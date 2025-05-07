@extends('layouts.app', ['title' => 'Profile Page'])
@section('content') 
    <profile-page
        :user="{{ json_encode($user) }}" 
        profile-image="{{ $profileImage }}">
    </profile-page>
@endsection