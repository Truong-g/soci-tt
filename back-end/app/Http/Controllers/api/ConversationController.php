<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Media;
use App\Models\Conversation;
use App\Models\ConversationMember;
use App\Models\Message;





class ConversationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    public function index()
    {
       $selfId = auth()->user()->id;
       $conversationContainer = [];
       $conversationMembers = ConversationMember::where("user_id", "=", $selfId)->get();
       foreach ($conversationMembers as $conversationMember) {
            $conversation = Conversation::find($conversationMember->conv_id);
            $members = ConversationMember::where("conv_id", "=", $conversation->id)->get();
            $memberContainer = [];
            foreach ($members as $m) {
                $user = User::where("id", "=", $m->user_id)->select("id", "fullname", "username", "email")->first();
                $userAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
                $user->avatar = $userAvatar->link;
                $user->status = $conversationMember->status;
                array_push($memberContainer, $user);
            }
            $conversation->member = $memberContainer;
            $convAvatar = Media::where([["type", "=", "conversation"], ["table_id", "=", $conversation->id]])->first();
            $conversation->avatar = $convAvatar ? $convAvatar->link : null;
            if($conversation->is_group === 1){
                $admin = User::where("id", "=", $conversation->group_admin)->select("id", "fullname", "username", "email")->first();
                $adminAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $admin->id]])->first();
                $admin->avatar = $adminAvatar->link;
                $conversation->group_admin = $admin;
            }
            array_push($conversationContainer, $conversation);
            $last_msg_person = User::where("id", "=", $m->user_id)->select("id", "fullname", "username", "email")->first();
            $last_msg_person_avatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
            $last_msg_person->avatar = $last_msg_person_avatar->link;
            $conversation->latest_msg_person = $last_msg_person;
       }
       return response()->json([
           "data" => $conversationContainer,
           "errCode" => 0,
           "message" => "get all conversation success"
       ], 200);
    }

    public function store(Request $request)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");
        $selfId = auth()->user()->id;
        if($request->isGroup){
            $groupConv = new Conversation();
            $groupConv->conv_name = $request->name;
            $groupConv->is_group = 1;
            $groupConv->group_admin = $selfId;
            if($groupConv->save()){
                $groupAvatar = new Media();
                $groupAvatar->link = $request->avatar;
                $groupAvatar->type = "conversation";
                $groupAvatar->table_id = $groupConv->id;
                $groupAvatar->save();
                $memberContainer = [];
                foreach ($request->member as $mem) {
                    $groupConvMember = new ConversationMember();
                    $groupConvMember->user_id = $mem;
                    $groupConvMember->conv_id = $groupConv->id;
                    $groupConvMember->save();

                    $user = User::where("id", "=", $mem)->select("id", "fullname", "username", "email")->first();
                    $userAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
                    $user->avatar = $userAvatar->link;
                    array_push($memberContainer, $user);
                }
                $groupConv->member = $memberContainer;
                $groupConv->avatar = $groupAvatar->link;
                $admin = User::where("id", "=", $groupConv->group_admin)->select("id", "fullname", "username", "email")->first();
                $adminAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $admin->id]])->first();
                $admin->avatar = $adminAvatar->link;
                $groupConv->group_admin = $admin;
                return response()->json([
                    "errCode" => 0,
                    "data" => $groupConv,
                    "message" => "create group conversation success"
                ], 201);
            }

        }else{
            $privateConv = new Conversation();
            if($privateConv->save()){
                $conv = Conversation::find($privateConv->id);
                $memberContainer = [];
                foreach ($request->member as $mem) {
                    $privateConvMember = new ConversationMember();
                    $privateConvMember->user_id = $mem;
                    $privateConvMember->conv_id = $privateConv->id;
                    $privateConvMember->save();

                    $user = User::where("id", "=", $mem)->select("id", "fullname", "username", "email")->first();
                    $userAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
                    $user->avatar = $userAvatar->link;
                    array_push($memberContainer, $user);
                }
                $conv->member = $memberContainer;
                $conv->avatar = null;

                return response()->json([
                    "errCode" => 0,
                    "data" => $conv,
                    "message" => "create private conversation success"
                ], 201);
            }
            
        }
    }

    public function topic(Request $request)
    {
        $conversation = Conversation::find($request->convId);
        $conversation->topic = $request->topic;
        $conversation->latest_msg = "Đã đổi chủ đề.";
        $conversation->latest_msg_person = auth()->user()->id;
        if($conversation->save()){
            $message = new Message();
            $message->sender_id = auth()->user()->id;
            $message->conv_id = $request->convId;
            $message->content = "Đã đổi chủ đề.";
            $message->save();
        }
        return response()->json([
            "errCode" => 0,
            "message" => "change topic success"
        ], 200);
    }

    public function delete(Request $request)
    {
        $conversation = Conversation::find($request->convId);
        $conversation->delete();
        $conversationMembers = ConversationMember::where("conv_id", "=", $request->convId)->get();
        foreach ($conversationMembers as $conversationMember) {
            $conversationMember->delete();
        }
        return response()->json([
            "errCode" => 0,
            "message" => "delete message success"
        ], 202);

    }

    public function leaveGroup(Request $request)
    {
        $selfId = auth()->user()->id;
        $conversationMember = ConversationMember::where([["conv_id", "=", $request->convId], ["user_id", "=", $selfId]])->first();
        $conversationMember->delete();
        $conversationMembers = ConversationMember::where("conv_id", "=", $request->convId)->get();
        $conversation = Conversation::find($request->convId);
        if(count($conversationMembers) <= 2){
            foreach ($conversationMembers as $convMem) {
                $convMem->delete();
            }
            $conversation->delete();
            return response()->json([
                "errCode" => 0,
                "message" => "delete conversation success"
            ], 202);
        }
        if($conversation->group_admin == $selfId){
            $conversation->group_admin = $conversationMembers[0]->id;
            $conversation->save();
            $user = User::where("id", "=", $conversationMembers[0]->id)->select("id", "username", "email", "fullname")->first();
            $userAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
            $user->avatar = $userAvatar->link;
            return response()->json([
                "data" => $user,
                "errCode" => 0,
                "message" => "leave success"
            ], 200);
        }else{
            return response()->json([
                "data" => null,
                "errCode" => 0,
                "message" => "leave success"
            ], 200);
        }
    }

    public function addMember(Request $request)
    {
       $conversationMember = new ConversationMember();
       $conversationMember->user_id = $request->userId;
       $conversationMember->conv_id = $request->convId;
       $conversationMember->save();
       return response()->json([
           "errCode" => 0,
           "message" => "add member success"
       ], 201);
    }
    public function delMember(Request $request)
    {
       $conversationMember = ConversationMember::where([["conv_id", "=", $request->convId], ["user_id", "=", $request->userId]])->first();
       $conversationMember->delete();
       return response()->json([
           "errCode" => 0,
           "message" => "delete member success"
       ], 202);
    }

    public function changeInfor(Request $request)
    {
        $conversation = Conversation::find($request->convId);
        if($request->avatar){
            
            $conversation->conv_name = $request->name;
            if($conversation->save()){
                $media = Media::where([["type", "=", "conversation"], ["table_id", "=", $request->convId]])->first();
                $media->link = $request->avatar;
                $media->save();
            }
        }else{
            $conversation->conv_name = $request->name;
            $conversation->save();
        }
        return response()->json([
            "errCode" => 0,
            "message" => "change infor chat success"
        ], 200);
    }

    
}
