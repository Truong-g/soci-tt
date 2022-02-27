<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Story;
use App\Models\User;
use App\Models\Media;


class StoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    public function store(Request $request)
    {

        date_default_timezone_set("Asia/Ho_Chi_Minh");
        $selfId = auth()->user()->id;
        $story = new Story();
        $story->link = $request->link;
        $story->user_id = $selfId;
        $story->save();
        return response()->json([
            "message" => "create story success",
            "errCode" => 0,
            "data" => $story->id
        ], 201);
    }

    public function index()
    {
       $stories = Story::select("id as id_story", "link", "user_id")->get();
       foreach($stories as $story){
           $user = User::find($story->user_id);
           $avatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
           $user->avatar = $avatar->link;
           $background = Media::where([["type", "=", "user_background"], ["user_id", "=", $user->id]])->first();
           $user->background = $background ? $background->link : null;
           $story->user = $user;
       }
       return response()->json([
           "data" => $stories,
           "message" => "get all story success",
           "errCode" => 0
       ], 200);
    }
}
