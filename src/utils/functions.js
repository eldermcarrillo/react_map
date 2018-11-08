import { forEach } from 'lodash'
import app from "../firebase";
require("firebase/database");
require("firebase/auth");

export function createBottonAndRefresh(func, name = 'refresh'){
  var btn = document.createElement("BUTTON");
  var t = document.createTextNode("BUTTONHIDDEN");
  btn.appendChild(t);
  btn.hidden = true;
  btn.id = name;
  document.body.appendChild(btn);
  btn.addEventListener("click", func);
  document.getElementById(name).click();
}

export function tokenCopyPaste(){
  if (window.localStorage.getItem('__token__')) return window.localStorage.getItem('__token__');
  return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC93d3cubGVhcm5pbmdlbmdsaXNoLnRlY25hY2lvbmFsLmVkdS5uaVwvIiwiYXVkIjoiaHR0cDpcL1wvd3d3LmxlYXJuaW5nZW5nbGlzaC50ZWNuYWNpb25hbC5lZHUubmlcLyIsImlhdCI6MTUzMjcwMzI1NCwiZXhwIjoxNTMyNzg5NjU0LCJjbGFpbXMiOnsiaXNfbG9ndWVkX2luIjp0cnVlLCJhbGxvd19hbGxfdW5pdHMiOiIkYWxsb3dfYWxsX3VuaXRzIiwicHJvZ3Jlc28iOiIkYWxsb3dfcHJvZ3Jlc3MiLCJpZF91c3VhcmlvIjoxMzUsInBlcmZpbCI6IiRhdXgiLCJ1c2VybmFtZSI6IiRjaGVja191c2VyLT51c2VybmFtZSIsImVtYWlsIjoiJGNoZWNrX3VzZXItPmVtYWlsIiwicHJvZmlsZSI6IiRjaGVja191c2VyLT5pbWFnZW4iLCJ0eXBlIjo0LCJncm91cCI6IiRhdXhncm91cCIsImZpcmViYXNlVG9rZW4iOiIkY3VzdG9tVG9rZW4ifX0.IZpHj1iVqW15gULRafQ3aCKW0HisqvcIcJ7NE59DzE0';
}

export function logout(){
  console.log('logout');
}

export function signs(value){
  if (value != '(' &&value != ')' && value != '“' && value != '”' && value != ',' && value != ';' && value != '.' && value != ':' && value != '\'' && value != '"' && value != '¿' && value != '?' && value != '¡' && value != '!' && value != '...' && value != '-') {
    return true;
  }else{
    return false;
  }
}

export function getTimeHHmmss(value){
  //convert seconds to time
  var hours = Math.floor(value / 3600);
  var minutes = Math.floor((value - (hours * 3600)) / 60);
  var seconds = value - (hours * 3600) - (minutes * 60);

  seconds = Math.round(seconds * 100) / 100

  var result = (hours < 10 ? "0" + hours : hours);
  result += ":" + (minutes < 10 ? "0" + minutes : minutes);
  result += ":" + (seconds < 10 ? "0" + seconds : seconds);

  return result;
}

export function getTimeHHmmssFromDate(value){
  var d = new Date(value);
  var date = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()
  return date;
}

export function timer(time = 6000){
  return window.setTimeout(function(){
    console.log('logout')
  }, time);
}

export function firebaseConnect(){
  /* -------------------------Auth user------------------------- */
  try {
    app.auth().onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) {

        /* -------------------------connect user------------------------- */
        var connect = app.database();

        var ref = connect.ref("onlineState");
        ref.onDisconnect().set(false);
        ref.onDisconnect().cancel();
        ref.onDisconnect().remove();

        ref = connect.ref("users/" + firebaseUser.uid + "/status");
        ref.onDisconnect().set("I disconnected!");
        ref = connect.ref("users/" + firebaseUser.uid);

        var aux = '';
        var len = window.localStorage.getItem('Group_FB').split('-').length;
        forEach(window.localStorage.getItem('Group_FB').split('-'), function (value, index) {
          if (value != '') {
            if (len - 2 == index) {
              aux = aux + value;
            } else {
              aux = aux + value + "-";
            }
          }
        });
        ref.update({
          username: window.localStorage.getItem('Username_FB'),
          email: window.localStorage.getItem('Email_FB'),
          image: window.localStorage.getItem('Image_FB'),
          type: window.localStorage.getItem('Type_FB'),
          group: aux,
          onlineState: true,
          status: "Online."
        });

        ref.onDisconnect().update({
          onlineState: false,
          status: "Offline."
        });
        /* -------------------------connect user------------------------- */

      } else {
        app.auth().signInAnonymously().catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
        });
      }
    });
  } catch (error) {
    //console.log(error);
  }
  /* -------------------------Auth user------------------------- */
}
