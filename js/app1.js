angular.module("app",["ngRoute"]);

angular.module("app", ["ngRoute"]).controller("MainController", function () {

    var vm = this;

    vm.title = "Learn AngularJS By Example";
    vm.searchInput = "";

    var uid = 5;

    vm.shows = [
        {
            fullname: 'Nguyen Huy Hoang',
            username: 'hoang',
            email: 'hoang@gmail.com',
            phone: '111 111 111',
            id: 0
        },
        {
            fullname: 'Vu Thi Thao Giang',
            username: 'thao giang',
            email: 'thaogiang@gmail.com',
            phone: '111 222 333',
            id: 1
        },
        {
            fullname: 'Nguyen Thi Thu Thanh',
            username: 'thanh',

            email: 'thanhnguyen@gmail.com',
            phone: '000 444 555',
            id: 2
        },
        {
            fullname: 'Nguyen Van Hoa',
            username: 'hoa nguyen',
            email: 'hoanguyen@gmail.com',
            phone: '999 999 999',
            id: 3
        },
        {
            fullname: 'Vu Quynh Anh',
            username: 'anh vu',
            email: 'vuanh@gmail.com',
            phone: '555 555 555',
            id: 4
        },

    ];

    vm.orders = [
        {
            id: 1,
            title: 'Username Ascending',
            key: 'username',
            reverse: false

        },
        {
            id: 2,
            title: 'Username Descending',
            key: 'username',
            reverse: true
        },
        {
            id: 3,
            title: 'Email Ascending',
            key: 'email',
            reverse: false

        },
        {
            is: 4,
            title: 'Email Descending',
            key: 'email',
            reverse: true
        }
    ];


    vm.order = vm.orders[0];
    vm.new = {};
    vm.addShow = function () {

        if (vm.addForm.$valid) {
            console.log('form is valid');
    
            if (vm.new.id == null) {
                vm.new.id = uid++;
                vm.shows.push(vm.new);
            }
            else {
                for (i in vm.shows) {
                    if (vm.shows[i].id == vm.new.id) {
                        vm.shows[i] = vm.new;
                    }
                }

            }

        }
        else {
            console.log('form is invalid!');
        }

        vm.new = {};

    };


    console.log(vm);

    vm.delete = function (id) {

        for (i in vm.shows) {
            if (vm.shows[i].id == id) {
                vm.shows.splice(i, 1);
                vm.new = {};
            }
        }
        vm.new = {};



    };

    vm.edit = function (id) {
        console.log('clicked');
        console.log(id);

        for (i in vm.shows) {
            if (vm.shows[i].id == id) {
                vm.new = angular.copy(vm.shows[i]);
            }
        }


    };


});