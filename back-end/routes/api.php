<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\AuthController;
use App\Http\Controllers\api\PostController;
use App\Http\Controllers\api\MediaController;
use App\Http\Controllers\api\FriendController;
use App\Http\Controllers\api\StoryController;
use App\Http\Controllers\api\GroupController;
use App\Http\Controllers\api\ConversationController;
use App\Http\Controllers\api\MessageController;
use App\Http\Controllers\api\CommentController;
use App\Http\Controllers\api\NotificationMemberController;










/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => 'api'], function($router) {
    Route::post('user/register', [AuthController::class, 'register']);
    Route::post('user/login', [AuthController::class, 'login']);
    Route::post('user/logout', [AuthController::class, 'logout']);
    Route::post('user/refresh', [AuthController::class, 'refresh']);
    Route::post('user/profile', [AuthController::class, 'profile']);
    Route::get('user/{userId}', [AuthController::class, 'getUser']);
    Route::get('user', [AuthController::class, 'index']);
    Route::post('user/update', [AuthController::class, 'update']);

});

Route::group(['middleware' => 'api'], function($router) {
    Route::post('post', [PostController::class, 'store']);
    Route::get('post', [PostController::class, 'index']);
    Route::get('post/videos', [PostController::class, 'getVideoPosts']);
    Route::post('post/reaction', [PostController::class, 'reaction']);
    Route::get('post/group/{groupId}', [PostController::class, 'getGroupPosts']);
    Route::get('post/{userId}', [PostController::class, 'getByUser']);

});

Route::group(['middleware' => 'api'], function($router) {
    Route::post('stories', [StoryController::class, 'store']);
    Route::get('stories', [StoryController::class, 'index']);

});

Route::group(['middleware' => 'api'], function($router) {
    Route::get('image/{userId}&limit={limit}', [MediaController::class, 'getImageUser']);
    Route::get('image/{userId}', [MediaController::class, 'getAllImageUser']);
    Route::post('image/change-avatar', [MediaController::class, 'changeAvatar']);
    Route::post('image/delete-avatar', [MediaController::class, 'deleteAvatar']);

});

Route::group(['middleware' => 'api'], function($router) {
    Route::get('friends', [FriendController::class, 'index']);
    Route::post('friends/send-request', [FriendController::class, 'sendRequest']);
    Route::post('friends/accept-request', [FriendController::class, 'acceptRequest']);
    Route::post('friends/unfrimate', [FriendController::class, 'unfrimate']);
});


Route::group(['middleware' => 'api'], function($router) {
    Route::get('group', [GroupController::class, 'index']);
    Route::post('group', [GroupController::class, 'store']);
});

Route::group(['middleware' => 'api'], function($router) {
    Route::get('conversation', [ConversationController::class, 'index']);
    Route::post('conversation', [ConversationController::class, 'store']);
    Route::post('conversation/topic', [ConversationController::class, 'topic']);
    Route::post('conversation/delete', [ConversationController::class, 'delete']);
    Route::post('conversation/leave-group', [ConversationController::class, 'leaveGroup']);
    Route::post('conversation/add-member', [ConversationController::class, 'addMember']);
    Route::post('conversation/del-member', [ConversationController::class, 'delMember']);
    Route::post('conversation/change-infor', [ConversationController::class, 'changeInfor']);

});


Route::group(['middleware' => 'api'], function($router) {
    Route::get('message/{convId}', [MessageController::class, 'index']);
    Route::post('message', [MessageController::class, 'store']);
    Route::post('message/revoke', [MessageController::class, 'revoke']);

});

Route::group(['middleware' => 'api'], function($router) {
    Route::get('comment/post/{postId}', [CommentController::class, 'postComments']);
    Route::post('comment/post', [CommentController::class, 'storePostComment']);
});

Route::group(['middleware' => 'api'], function($router) {
    Route::get('notification', [NotificationMemberController::class, 'index']);
    Route::post('notification/delete', [NotificationMemberController::class, 'delete']);
});



