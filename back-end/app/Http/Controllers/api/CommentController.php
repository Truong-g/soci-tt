<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Comment;
use App\Models\User;
use App\Models\Media;
use App\Models\NotificationMember;
use App\Models\Post;




class CommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }


    public function postComments($postId)
    {
        $postCmts = Comment::where([["type", "=", "post"], ["table_id", "=", $postId], ["parent_id", "=", 0]])->orderBy("created_at", "desc")->get();

        foreach ($postCmts as $postCmt) {
            $user = User::where("id", "=", $postCmt->user_id)->select("id", "fullname", "username", "email")->first();
            $userAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
            $user->avatar = $userAvatar->link;
            $postCmt->user = $user;

            $childCmts = Comment::where([["type", "=", "post"], ["table_id", "=", $postId], ["parent_id", "=", $postCmt->id]])->get();
            foreach($childCmts as $childCmt){
                $user = User::where("id", "=", $childCmt->user_id)->select("id", "fullname", "username", "email")->first();
                $userAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
                $user->avatar = $userAvatar->link;
                $childCmt->user = $user;
            }
            $postCmt->child_comments = $childCmts;
            $post = Post::find($postId);
            $postCmt->self_id = $post->sender_id;
        }
        return response()->json([
            "data" => $postCmts,
            "message" => "Get post comment success",
            "errCode" => 0
        ], 200);
    }

    public function storePostComment(Request $request)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");
        $selfId = auth()->user()->id;
        $comment = new Comment();
        $comment->type = $request->type;
        $comment->table_id = $request->postId;
        $comment->user_id = $selfId;
        $comment->content = $request->content;
        $comment->parent_id = $request->parentId;
        if($comment->save()){
            $user = User::where("id", "=", $comment->user_id)->select("id", "fullname", "username", "email")->first();
            $userAvatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
            $user->avatar = $userAvatar->link;
            $comment->user = $user;
            $comment->child_comments = [];
            $post = Post::find($request->postId);
            $comment->self_id = $post->sender_id;

            if($selfId != $request->selfId){
                $notification = new NotificationMember();
                $notification->user_id = $selfId;
                $notification->self_id = $request->selfId;
                $notification->type = "comment";
                $notification->table_id = $request->postId;
                $notification->status = 2;
                $notification->save();
                $comment->notification_id =  $notification->id;
            }

            return response()->json([
                'data' => $comment,
                'message' => "Create post Comment success",
                'errCode' => 0
            ], 201);
        }
        
    }
}
