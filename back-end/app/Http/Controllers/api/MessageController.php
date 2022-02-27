<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Message;
use App\Models\User;
use App\Models\Media;
use App\Models\Conversation;
use App\Models\ConversationMember;




class MessageController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index($convId)
    {
        $changeStatus = ConversationMember::where([["user_id", "=", auth()->user()->id], ["conv_id", "=", $convId]])->first();
        $changeStatus->status = 1;
        $changeStatus->save();
        $messages = Message::where("conv_id", "=", $convId)->orderBy("created_at", "asc")->get();
        foreach($messages as $msg){
            $sender = User::where("id", "=", $msg->sender_id)->select("id", "username", "email", "fullname")->first();
            $avatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $sender->id]])->first();
            $sender->avatar = $avatar->link;
            $msg->sender = $sender;
            unset($msg->sender_id);
        }
        return response()->json([
            "data" => $messages,
            "message" => "get messages success",
            "errCode" => 0
        ], 200);
    }

    public function store(Request $request)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");
        $selfId = auth()->user()->id;

        $checkMember = ConversationMember::where([["convId", "=", $request->convId], ["user_id", "=", $selfId]])->first();
        if(!$checkMember){
            return response()->json([
                "errCode" => 1,
                "message" => "not find user"
            ], 401);
        }

        if($request->type === "text"){
            $message = new Message();
            $message->sender_id = $selfId;
            $message->conv_id = $request->convId;
            $message->content = $request->content;
            if($message->save()){
                $conversation = Conversation::find($request->convId);
                $conversation->latest_msg = $request->content;
                $conversation->latest_msg_person = $selfId;
                $conversation->save();
                $convMembers = ConversationMember::where("conv_id", "=", $request->convId)->get();
                foreach($convMembers as $convMember) {
                    $convMember->status = 2;
                    $convMember->save();
                }
            }
        }

        if($request->type === "image"){
            $message = new Message();
            $message->sender_id = $selfId;
            $message->conv_id = $request->convId;
            $message->image = $request->image;
            if($message->save()){
                $conversation = Conversation::find($request->convId);
                $conversation->latest_msg = "Đã gửi 1 hình ảnh";
                $conversation->latest_msg_person = $selfId;
                $conversation->save();
            }
        }

        if($request->type === "video"){
            $message = new Message();
            $message->sender_id = $selfId;
            $message->conv_id = $request->convId;
            $message->video = $request->video;
            if($message->save()){
                $conversation = Conversation::find($request->convId);
                $conversation->latest_msg = "Đã gửi 1 đoạn video";
                $conversation->latest_msg_person = $selfId;
                $conversation->save();
            }
        }

        if($request->type === "record"){
            $message = new Message();
            $message->sender_id = $selfId;
            $message->conv_id = $request->convId;
            $message->record = $request->record;
            if($message->save()){
                $conversation = Conversation::find($request->convId);
                $conversation->latest_msg = "Đã gửi 1 đoạn ghi âm";
                $conversation->latest_msg_person = $selfId;
                $conversation->save();
            }
        }

        if($request->type === "sticker"){
            $message = new Message();
            $message->sender_id = $selfId;
            $message->conv_id = $request->convId;
            $message->sticker = $request->sticker;
            if($message->save()){
                $conversation = Conversation::find($request->convId);
                $conversation->latest_msg = "Đã gửi 1 nhãn dán";
                $conversation->latest_msg_person = $selfId;
                $conversation->save();
            }
        }
        return response()->json([
            "message" => "store message success",
            "errCode" => 0
        ], 200);
    }

    public function revoke(Request $request)
    {
        # code...
    }
}
