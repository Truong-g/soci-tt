<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Friend;
use App\Models\Media;


class FriendController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
       $selfId = auth()->user()->id;
       $listFriend = [];
       $friends = Friend::where("active_id", "=", $selfId)->orWhere("passive_id", "=", $selfId)->get();
       foreach($friends as $friend){
           $user = User::find($friend->active_id == $selfId ? $friend->passive_id : $friend->active_id);
           $avatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
           $user->avatar = $avatar->link;
           $background = Media::where([["type", "=", "user_background"], ["user_id", "=", $user->id]])->first();
           $user->background = $background ? $background->link : null;
           $user->passive_id = $friend->passive_id;
           $user->active_id = $friend->active_id;
           $user->status_friend = $friend->status;
           array_push($listFriend, $user);
       }

       return response()->json([
           "data" => $listFriend,
           "message" => "Get friend Sucess",
            "errCode" => 0
       ], 200);
    }

    public function sendRequest(Request $request)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");

        $activeId = auth()->user()->id;

        $checkFriend = Friend::where([["passive_id", "=", $activeId], ["active_id", "=", $request->user_id]])
        ->orWhere([["passive_id", "=", $request->user_id], ["active_id", "=", $activeId]])
        ->first();
        if($checkFriend){
            return response()->json([
                "errCode" => 1,
                "message" => "friend exists"
            ], 401);
        }
        
        $friend = new Friend();
        $friend->active_id = $activeId;
        $friend->passive_id = $request->user_id;
        $friend->status = 2;
        $friend->save();
        return response()->json([
            "errCode" => 0,
            "message" => "Send request to friend success"
        ], 200);
    }

    public function acceptRequest(Request $request)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");
        $activeId = auth()->user()->id;
        $friend = Friend::where([["passive_id", "=", $activeId], ["active_id", "=", $request->user_id], ["status", "=", 2]])->first();
        $friend->status = 1;
        $friend->save();
        return response()->json([
            "errCode" => 0,
            "message" => "Accept request to friend success"
        ], 200);

    }

    public function unfrimate(Request $request)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");
        $activeId = auth()->user()->id;
        $friend = Friend::where([["passive_id", "=", $activeId], ["active_id", "=", $request->user_id]])
        ->orWhere([["passive_id", "=", $request->user_id], ["active_id", "=", $activeId]])
        ->first();
        $friend->delete();
        return response()->json([
            "errCode" => 0,
            "message" => "unfrimate to friend success"
        ], 202);
    }
}
