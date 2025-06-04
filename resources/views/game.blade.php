@extends('layouts.app', ['title' => 'Game Page'])

@section('content')
    <meta name="csrf-token" content="{{ csrf_token() }}">
    {{-- <game-page :game-id="{{ $game->id }}" /> --}}
        <game-page/>
@endsection