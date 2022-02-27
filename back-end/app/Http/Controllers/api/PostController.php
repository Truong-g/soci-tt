<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use App\Models\Post;
use App\Models\Media;
use App\Models\Comment;
use App\Models\Reaction;
use App\Models\User;
use App\Models\NotificationMember;






class PostController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    public function index()
    {
        $posts = Post::where([["type", "=", "public"], ["group_id", "=", null], ["status", "=", 1]])->orderBy("created_at", "desc")->paginate(7);
        
        foreach($posts->items() as $post){
            $media = Media::where([["type", "=", "post"], ["table_id", "=", $post->id]])->select("type", "type_child", "link")->first();
            $post->media = $media ? $media : null;
            $sender = User::where("id", '=', $post->sender_id)->select("id", "username", "fullname", "email")->first();
            $avatar_sender = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $post->sender_id]])->first();
            $sender->avatar = $avatar_sender->link;
            unset($post->sender_id);
            $post->sender = $sender;
            $reaction = Reaction::where([["type", "=", "post"], ["table_id", "=", $post->id]])->orderBy("created_at", "desc")->get();
            if(count($reaction)){
                unset($reaction->id);
                unset($reaction->table_id);
                unset($reaction->type);
            }
            $post->reaction = $reaction;
            $number_comment = Comment::where([["type", "=", "post"], ["table_id", "=", $post->id]])->count();
            $post->comment = $number_comment;
        }
        return response()->json([
            "errCode" => 0,
            "data" => $posts,
            "message" => "get all post public success"
        ], 200);
    }

    public function getGroupPosts($groupId)
    {
        $posts = Post::where([["type", "=", "private"], ["group_id", "=", $groupId], ["status", "=", 1]])->orderBy("created_at", "desc")->paginate(7);
        
        foreach($posts->items() as $post){
            $media = Media::where([["type", "=", "post"], ["table_id", "=", $post->id]])->select("type", "type_child", "link")->first();
            $post->media = $media ? $media : null;
            $sender = User::where("id", '=', $post->sender_id)->select("id", "username", "fullname", "email")->first();
            $avatar_sender = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $post->sender_id]])->first();
            $sender->avatar = $avatar_sender->link;
            unset($post->sender_id);
            $post->sender = $sender;
            $reaction = Reaction::where([["type", "=", "post"], ["table_id", "=", $post->id]])->orderBy("created_at", "desc")->get();
            if(count($reaction)){
                unset($reaction->id);
                unset($reaction->table_id);
                unset($reaction->type);
            }
            $post->reaction = $reaction;
            $number_comment = Comment::where([["type", "=", "post"], ["table_id", "=", $post->id]])->count();
            $post->comment = $number_comment;
        }
        return response()->json([
            "errCode" => 0,
            "data" => $posts,
            "message" => "get post private success"
        ], 200);
    }

    public function store(Request $request)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");

        $link = null;

        $post = new Post();
        $post->group_id = $request->groupId ? $request->groupId : null;
        $post->sender_id = auth()->user()->id;
        $post->type = $request->postType;
        $post->content = $request->content;
        if($post->save()){
            if($request->hasMedia){
                $media = new Media();
                $media->link = $request->link;
                $media->type = $request->mediaType;
                $media->type_child = $request->mediaTypeChild;
                $media->table_id = $post->id;
                $media->user_id = auth()->user()->id;
                $media->save();
                $link = ["link" => $media->link, "type" => $media->type, "type_child" => $media->type_child];
            }
                     
        }

        $post->media = $link;
        $post->reaction = [];
        $post->comment = 0;
        $sender = User::where("id", '=', $post->sender_id)->select("id", "username", "fullname", "email")->first();
        $avatar_sender = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $post->sender_id]])->first();
        $sender->avatar = $avatar_sender->link;
        unset($post->sender_id);
        $post->sender = $sender;


        return response()->json([
            "errCode" => 0,
            "data" => $post,
            "message" => "Create post success"
        ], 201);

    }

    public function reaction(Request $request)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");
        $selfId = auth()->user()->id;
        
        $checkExists = Reaction::where([["type", "=", $request->type], ["table_id", "=", $request->tableId], ["type_reaction", "=", $request->typeReaction], ["user_id", "=", $selfId]])->first();
        if($checkExists){
            $checkExists->delete();
            return response()->json([
                "errCode" => 0,
                "message" => "cancel react success"
            ], 202);
        }else{
            $checkUpdate = Reaction::where([["type", "=", $request->type], ["table_id", "=", $request->tableId], ["user_id", "=", $selfId]])->first();
            if($checkUpdate){
                $checkUpdate->type_reaction = $request->typeReaction;
                $checkUpdate->save();
                return response()->json([
                    "errCode" => 0,
                    "message" => "update react success"
                ], 200);
            }else{
                $newReaction = new Reaction();
                $newReaction->type = $request->type;
                $newReaction->type_reaction = $request->typeReaction;
                $newReaction->table_id = $request->tableId;
                $newReaction->user_id = $selfId;
                if($newReaction->save()){
                    if($selfId != $request->selfId){
                        $notification = new NotificationMember();
                        $notification->user_id = $selfId;
                        $notification->self_id = $request->selfId;
                        $notification->type = "comment";
                        $notification->table_id = $newReaction->table_id;
                        $notification->status = 2;
                        $notification->save();
                        $newReaction->notification_id =  $notification->id;
                        $user = User::where("id", '=', $selfId)->select("id", "username", "fullname", "email")->first();
                        $userAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
                        $user->avatar = $userAvatar->link;
                        $newReaction->user = $user;
                    }
                }
                return response()->json([
                    "errCode" => 0,
                    "data" => $newReaction,
                    "message" => "create react success"
                ], 200);
            }

        }

    }

    public function getByUser($userId)
    {
        $posts = Post::where([["type", "=", "public"], ["group_id", "=", null], ["status", "=", 1], ["sender_id", "=", $userId]])->orderBy("created_at", "desc")->paginate(7);
        
        foreach($posts->items() as $post){
            $media = Media::where([["type", "=", "post"], ["table_id", "=", $post->id]])->select("type", "type_child", "link")->first();
            $post->media = $media ? $media : null;
            $sender = User::where("id", '=', $post->sender_id)->select("id", "username", "fullname", "email")->first();
            $avatar_sender = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $post->sender_id]])->first();
            $sender->avatar = $avatar_sender->link;
            unset($post->sender_id);
            $post->sender = $sender;
            $reaction = Reaction::where([["type", "=", "post"], ["table_id", "=", $post->id]])->orderBy("created_at", "desc")->get();
            if(count($reaction)){
                unset($reaction->id);
                unset($reaction->table_id);
                unset($reaction->type);
            }
            $post->reaction = $reaction;
            $number_comment = Comment::where([["type", "=", "post"], ["table_id", "=", $post->id]])->count();
            $post->comment = $number_comment;
        }



        return response()->json([
            "errCode" => 0,
            "data" => $posts,
            "message" => "get post by user public success"
        ], 200);
    }

    public function getVideoPosts()
    {
        $posts = Post::where([["type", "=", "public"], ["group_id", "=", null], ["status", "=", 1]])->orderBy("created_at", "desc")->get();
        foreach($posts as $post){
            $media = Media::where([["type", "=", "post"], ["table_id", "=", $post->id]])->select("type", "type_child", "link")->first();
            $post->media = $media ? $media : null;
            $sender = User::where("id", '=', $post->sender_id)->select("id", "username", "fullname", "email")->first();
            $avatar_sender = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $post->sender_id]])->first();
            $sender->avatar = $avatar_sender->link;
            unset($post->sender_id);
            $post->sender = $sender;
            $reaction = Reaction::where([["type", "=", "post"], ["table_id", "=", $post->id]])->orderBy("created_at", "desc")->get();
            if(count($reaction)){
                unset($reaction->id);
                unset($reaction->table_id);
                unset($reaction->type);
            }
            $post->reaction = $reaction;
            $number_comment = Comment::where([["type", "=", "post"], ["table_id", "=", $post->id]])->count();
            $post->comment = $number_comment;
        }
        return response()->json([
            "errCode" => 0,
            "data" => $posts,
            "message" => "get all post public success"
        ], 200);
    }
}
