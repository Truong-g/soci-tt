<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Media;


class MediaController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getImageUser($userId, $limit)
    {
        $images = Media::where([["type", "=", "post"], ["type_child", "=", "post_image"], ["user_id", "=", $userId]])
        ->orWhere([["type", "=", "user_avatar"], ["user_id", "=", $userId]])
        ->orWhere([["type", "=", "user_background"], ["user_id", "=", $userId]])
        ->limit($limit)->orderBy("created_at", "desc")->get();
        return response()->json([
            "data" => $images,
            "errCode" => 0,
            "message" => "Get images by user success"
        ], 200);
    }

    public function getAllImageUser($userId)
    {
        # code...
    }

    public function changeAvatar(Request $request)
    {
        $selfId = auth()->user()->id;
        $avatar = Media::where([["user_id", "=", $selfId], ["link", "=", $request->oldAvatar]])->first();
        $avatar->link = $request->newAvatar;
        $avatar->save();

        return response()->json([
            "message" => "change avatar success",
            "errCode" => 0
        ], 200);
    }

    public function deleteAvatar(Request $request)
    {
        $selfId = auth()->user()->id;
        $avatar = Media::find($request->id);
        $avatar->delete();
        return response()->json([
            "message" => "delete avatar success",
            "errCode" => 0
        ], 202);
    }
    
}
