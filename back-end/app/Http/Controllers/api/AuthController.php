<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;
use Illuminate\Support\Str;

use App\Models\User;
use App\Models\Media;




class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }


    public function register(Request $request)
    {
        date_default_timezone_set("Asia/Ho_Chi_Minh");

        $validator = Validator::make($request->all(), [
            'username' => 'unique:users',
            'email' => 'unique:users',
        ]);

        if($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = new User();
        $user->username = $request->username;
        $user->fullname = $request->fullname;
        $user->email = $request->email;
        $user->password = bcrypt($request->password);
        if($user->save()){
            $avatar = new Media();
            $avatar->link = "https://res.cloudinary.com/dwfjhv7mr/image/upload/v1643363569/avatar-none_ns3jx9.png";
            $avatar->type = "user_avatar";
            $avatar->user_id = $user->id;
            $avatar->save();
        }

        return response()->json([
            "errCode" => 0,
            'message' => 'User successfully registered',
        ], 201);
    }

    /**
     * login user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        if (!$token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Logout user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth()->logout();

        return response()->json(['message' => 'User successfully logged out.']);
    }

    /**
     * Refresh token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * Get user profile.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function profile()
    {
        $user = auth()->user();
        $avatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
        $user->avatar = $avatar->link;
        $background = Media::where([["type", "=", "user_background"], ["user_id", "=", $user->id]])->first();
        $user->background = $background ? $background->link : null;
        return response()->json([
            "errCode" => 0,
            "data" => $user,
            "message" => "Get profile success"
        ], 201);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }

    public function getUser($userId)
    {
        $user = User::find($userId);
        $avatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $userId]])->first();
        $user->avatar = $avatar->link;
        $background = Media::where([["type", "=", "user_background"], ["user_id", "=", $userId]])->first();
        $user->background = $background ? $background->link : null;
        return response()->json([
            "errCode" => 0,
            "data" => $user,
            "message" => "Get user success"
        ], 201);
    }

    public function update(Request $request)
    {
        $user = User::find(auth()->user()->id);
        $user->fullname = $request->fullname;
        $user->address = $request->address;
        $user->birthday = date("Y-m-d", $request->birthday / 1000);
        $user->case_love = $request->case_love;
        $user->duty = $request->duty;
        $user->intro = $request->intro;
        $user->learn_at = $request->learn_at;
        $user->work_at = $request->work_at;
        $user->phone = $request->phone;
        if($user->save()){
            $avatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
            $avatar->link = $request->avatar;
            $avatar->save();
            $user->avatar = $avatar->link;
            $background = Media::where([["type", "=", "user_background"], ["user_id", "=", $user->id]])->first();
            if($background){
                $background->link = $request->background;
                $background->save();
                $user->background = $background->link;
            }else{
                if($request->background){
                    $newBackground = new Media();
                    $newBackground->link = $request->background;
                    $newBackground->type = "user_background";
                    $newBackground->user_id = $user->id;
                    $newBackground->save();
                    $user->background = $newBackground->link;
                }else{
                    $user->background = null;
                }
            }
        }
        return response()->json([
            "errCode" => 0,
            "data" => $user,
            "message" => "update profile success"
        ], 201);
    }


    public function index()
    {
        $users = User::where([["status", "=", 1], ["id", "!=", auth()->user()->id]])->get();
        foreach($users as $user){
            $avatar = Media::where([["type", "=", "user_avatar"], ["user_id", "=", $user->id]])->first();
            $user->avatar = $avatar->link;
            $background = Media::where([["type", "=", "user_background"], ["user_id", "=", $user->id]])->first();
            $user->background = $background ? $background->link : null;
        }
        return response()->json([
            "message" => "get all users success",
            "data" => $users,
            "errCode" => 0
        ], 200);
    }
}
