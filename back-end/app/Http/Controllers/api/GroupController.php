<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\GroupMember;
use App\Models\Group;
use App\Models\Media;


class GroupController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function index()
    {
        $selfId = auth()->user()->id;
        $listGroups = Group::get();
        foreach($listGroups as $itemGroup){
            $group_avatar = Media::where([["type", "=", "group_avatar"], ["table_id", "=", $itemGroup->id]])->first();
            $itemGroup->group_avatar = $group_avatar->link;
            $group_bg = Media::where([["type", "=", "group_background"], ["table_id", "=", $itemGroup->id]])->first();
            $itemGroup->group_bg = $group_bg->link;

            $groupMembers = GroupMember::where("group_id", "=", $itemGroup->id)->get();
            $memberContainer = [];
            foreach($groupMembers as $groupMember){
                $user = User::find($groupMember->user_id);
                $avatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
                $user->avatar = $avatar->link;
                $background = Media::where([["type", "=", "user_background"], ["user_id", "=", $user->id]])->first();
                $user->background = $background ? $background->link : null;
                $selectedInfor = ["id" => $user->id, "fullname" => $user->fullname, "username" => $user->username, "email" => $user->email, "avatar" => $user->avatar, "background" => $user->background];
                array_push($memberContainer, $selectedInfor);
            }
            $itemGroup->member = $memberContainer;
        }
        return response()->json([
            "data" => $listGroups,
            "message" => "find ".count($listGroups)." your groups",
            "errCode" => 0
        ], 200);
    }

    public function store(Request $request)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");
        
        $selfId = auth()->user()->id;
        $group = new Group();
        $group->group_name = $request->groupName;
        $group->intro = $request->intro;
        $group->group_admin = $selfId;
        if($group->save()){
            $avatar = new Media();
            $avatar->link = $request->avatar;
            $avatar->type = "group_avatar";
            $avatar->table_id = $group->id;
            $avatar->save();
            $group->group_avatar = $avatar->link;
            $background = new Media();
            $background->link = $request->background;
            $background->type = "group_background";
            $background->table_id = $group->id;
            $background->save();
            $group->group_bg = $background->link;

            $memberContainer = [];
            foreach($request->member as $m){
                $groupMember = new GroupMember();
                $groupMember->user_id = $m;
                $groupMember->group_id = $group->id;
                $groupMember->save();
                $user = User::find($groupMember->user_id);
                $avatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
                $user->avatar = $avatar->link;
                $background = Media::where([["type", "=", "user_background"], ["user_id", "=", $user->id]])->first();
                $user->background = $background ? $background->link : null;
                $selectedInfor = ["id" => $user->id, "fullname" => $user->fullname, "username" => $user->username, "email" => $user->email, "avatar" => $user->avatar, "background" => $user->background];
                array_push($memberContainer, $selectedInfor);
            }
            $group->member = $memberContainer;
        }

        return response()->json([
            "errCode" => 0,
            "data" => $group,
            "message" => "create group success"
        ], 200);
    }
}
