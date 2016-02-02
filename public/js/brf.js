(function(){
    'use strict';

angular.module('brainfuckApp', [])


angular.module('brainfuckApp').controller('brainfuckController', function($scope, $http ,$timeout, $interval) {

        $scope.memory = new Array();
        $scope.memory[0]=0;
        $scope.memoryPointer = 0;
        $scope.codePointer = 0;
        $scope.code = "++++++++++[>+++++++>++++++++++>+++>+<<<<-]>++.>+.+++++++..+++.>++.<<+++++++++++++++.>.+++.------.--------.>+.>.";
        $scope.isDebuging = false;
        $scope.isRunning = false;
        $scope.atBereakPoint = false;
        $scope.output_text = '';
        $scope.pause_time = 200;

        $scope.Command = {};

        $scope.Command['>'] = function($scope) {
            $scope.memoryPointer++;
            if($scope.memory.length==$scope.memoryPointer)
                $scope.memory[$scope.memoryPointer]=0;
        }
        $scope.Command['<'] = function($scope) {
            $scope.memoryPointer--;
            if($scope.memoryPointer<0) $scope.error("negative memory index");
        }
        $scope.Command['+'] = function($scope) {
            if($scope.memory[$scope.memoryPointer]<255)
                $scope.memory[$scope.memoryPointer]+=1;
            else  $scope.memory[$scope.memoryPointer]=0;
        }
        $scope.Command['-'] = function($scope) {
            if($scope.memory[$scope.memoryPointer]>0)
                $scope.memory[$scope.memoryPointer]-=1;
            else  $scope.memory[$scope.memoryPointer]=255;
        }
        $scope.Command[','] = function($scope) {
            $scope.memory[$scope.memoryPointer]=$scope.input();
            if($scope.memory[$scope.memoryPointer]>255) $scope.memory[$scope.memoryPointer]=255;
            if($scope.memory[$scope.memoryPointer]<0) $scope.memory[$scope.memoryPointer]=0;
        }

        $scope.Command['.'] = function($scope) {
            $scope.output($scope.memory[$scope.memoryPointer]);
        }

        $scope.Command['['] = function($scope) {
            if ($scope.memory[$scope.memoryPointer] == 0) $scope.to_loop_end();
        }
        $scope.Command[']'] = function($scope) {
            if ($scope.memory[$scope.memoryPointer] > 0)
                $scope.to_loop_start();
        }
        $scope.Command['#'] = function($scope) {

        }

        $scope.reset = function () {
            this.memory = new Array();
            this.memoryPointer = 0;
            this.codePointer = 0;
            this.isDebuging = false;
            this.isRunning = false;
            this.atBereakPoint = false;
        };

        $scope.to_loop_end=function(){
            for(var loops  = 1; loops!=0; this.code_step_forward())
                if(this.code[this.codePointer+1]==']')  loops-=1;
                else if(this.code[this.codePointer+1]=='[') loops+=1;
        }

        $scope.to_loop_start=function(){
            for(var loops  = 1; loops!=0; this.code_step_backwards())
                if(this.code[this.codePointer-1]==']')  loops+=1;
                else if(this.code[this.codePointer-1]=='[') loops-=1;
        }
        $scope.code_step_forward=function(){
            this.codePointer+=1;
            if(this.code.length==this.codePointer)
                this.error("unexpected end of code");
        }
        $scope.code_step_backwards=function(){
            this.codePointer-=1;
            if(this.codePointer<0)
                this.error("unexpected end of code");
        }

        $scope.execute = function(){
            if(!this.Command[this.code[this.codePointer]]){
                alert(this.code[this.codePointer]);
                this.error('unexpected symbol');
            }
            this.Command[this.code[this.codePointer]]($scope);
        }

        $scope.step = function() {
            this.execute();
            this.codePointer+=1;
            if (!this.code[this.codePointer]) {
                this.isRunning=false;
                this.isDebuging=false;
            }
        }
        $scope.run=function(){
            if(!this.isRunning||!this.isDebuging){
                this.reset();
                this.memory[0]=0;
                this.isRunning = true;
                this.run_next();
            }
        }
        $scope.run_next = function(){
                this.step();
                var scope = this;
                if(this.isRunning)
                    $timeout(function(){scope.run_next();}, this.pause_time);
        }

        $scope.run_to_breakpoint = function(){
            if(!this.isRunning){
                this.atBereakPoint=false;
                if(!this.isDebuging) {
                    this.reset();
                    this.memory[0]=0;
                    this.isDebuging = true;
                }
                this.atBereakPoint=false;
                while(this.isDebuging && !this.atBereakPoint){

                    this.debug_step();
                }
            }

        }
        $scope.error = function(message){
            alert(message);
            this.reset();
        }
        $scope.input = function() {
            while (true){
                let char = prompt("enter data (1 character)");
                if(!char) continue;
                if (char.length==1){
                    let char_code=char.charCodeAt(0);
                    return char_code;
                }
            }
        }
        $scope.output = function(a){
            this.output_text+=String.fromCharCode(a);
        }
        $scope.debug_step = function(){
            this.execute();
            this.codePointer+=1;
            if(this.code[this.codePointer]=='#') this.atBereakPoint = true;
            if(!this.code[this.codePointer]) {
                this.isRunning=false;
                this.isDebuging=false;
            }
        }
    angular.element(document).ready(function(){

    });
    // $scope.getFileContent = function($event){
    //     $event.currentTarget;
    // }
    $scope.createFile = function(){
        alert($('#createFileName').val());
        $http({
                method: 'POST',
                data: {name: $('#createFileName').val()},
                url: '/createfile'
            }).then(function successCallback(response) {
                console.clear();
                console.log();
            }, function errorCallback(response) {
            });
    }
    $scope.deleteFile = function(){
        $http({
            method: 'DELETE',
            data: {name: $('#deleteFileName').val()},
            url: '/deletefile'
        }).t
        hen(function successCallback(response) {
            console.clear();
            console.log();
        }, function errorCallback(response) {
        });

    }
    $scope.refresh = function(){
        location.reload();
    }
    $interval(callAtInterval, 10000);
    function callAtInterval() {
        if($('.f-jpg').length) {
            $http({
                method: 'POST',
                data: {name: $('.f-jpg').siblings('.name').text(), content: $('#code').val()},
                url: '/refreshcontent'
            }).then(function successCallback(response) {
                console.clear();
                console.log();
            }, function errorCallback(response) {
            });
        }
    }
});
})();