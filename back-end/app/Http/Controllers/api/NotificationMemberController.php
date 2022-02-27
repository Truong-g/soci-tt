<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\NotificationMember;
use App\Models\User;
use App\Models\Media;



class NotificationMemberController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $notifications = NotificationMember::where("self_id", "=", auth()->user()->id)->orderBy("created_at", "desc")->get();
        foreach ($notifications as $notification) {
            $user = User::where("id", "=", $notification->user_id)->select("id", "fullname", "username", "email")->first();
            $userAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
            $user->avatar = $userAvatar->link;
            $notification->user = $user;
            unset($notification->user_id);
        }

        return response()->json([
            "data" => $notifications,
            "message" => "get notification success",
            "errCode" => 0
        ], 200);
    }

    public function delete(Request $request)
    {
        $notification = NotificationMember::find($request->id);
        $notification->delete();
        return response()->json([
            "errCode" => 0,
            "message" => "delete success"
        ], 202);
    }
}
