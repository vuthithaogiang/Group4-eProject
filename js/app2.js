var app = angular.module('app', []);

function Validator(options) {

    function getParent(element, selector) {

        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {

                return element.parentElement;
            }

            element = element.parentElement;

        }

    }

    var selectorRules = {};

    //console.log(options.rules);

    function validate(inputElement, rule) {

        var errorMessage; // = rule.test(inputElement.value);

        //console.log(errorMessage);

        // Exspect: spanElement = getParent (inputElement, '.form-group')
        var spanErrorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);

        //lay ra cac rules ua selector 
        var rules = selectorRules[rule.selector];
        //console.log(rules);


        //lap qua tunwg rule va check luon
        // neu co loi thi dung viec kiem tra
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );


                    break;

                default:
                    errorMessage = rules[i](inputElement.value);

            }

            if (errorMessage) {
                break; // khi co loi thoat luon
            }

        }


        if (errorMessage) {
            //lay the cha cua input (div) => lay the con span
            //console.log(inputElement.parentElement.querySelector('.form-message'));

            //var spanErrorElement = inputElement.parentElement.querySelector(".form-message");
            console.log(spanErrorElement);


            spanErrorElement.innerText = errorMessage;

            //add red color for active 
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');

        } else {
            spanErrorElement.innerText = '';
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');

        }

        return !errorMessage;

    }

    //lay element cua form can validate 
    var formElement = document.querySelector(options.form);

    console.log(formElement);




    if (formElement) {
        //xu li su kien submit
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;

            // lap qua tung rule  & validate luon

            options.rules.forEach(function (rule) {

                var inputElement = formElement.querySelector(rule.selector);


                var isValid = validate(inputElement, rule);

                if (!isValid) {

                    isFormValid = false;
                }


            });

            if (isFormValid) {
                console.log('Khong co loi');


                //case: submit voi javascript
                if (typeof options.onSubmit === 'function') {

                    //select all fields:  attributes la name va khong cos attribute la disable
                    var enableInputs = formElement.querySelectorAll('[name]:not([disable])');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {

                        switch (input.type) {
                            case 'radio':

                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;

                            case 'checkbox':
                                if (!input.matches(':checked')) return values;


                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }


                                // luon luon la array

                                values[input.name].push(input.value);
                                break;

                            case 'file':
                                values[input.name] = input.files;
                                break;

                            default:
                                values[input.name] = input.value;

                        }

                        return values;

                    }, {});

                    options.onSubmit(formValues);
                }
                //case: submit voi fowm mac dinhj cua trinh duyet
                else {

                    formElement.submit();

                }

            }
            else {
                console.log('co loi!');
            }
        }

        //lap qua moi rules va xu li tung rule: xu lis event: blur, oninput ....
        options.rules.forEach(function (rule) {
            //luu lai tat ca cac rules cho moi input

            if (Array.isArray(selectorRules[rule.selector])) {

                selectorRules[rule.selector].push(rule.test);

            }

            else {
                selectorRules[rule.selector] = [rule.test];
            }


            console.log(rule.selector);
            console.log(formElement.querySelector(rule.selector));

            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(function (inputElement) {

                if (inputElement) {

                    // khi user blur ra ngoai
                    inputElement.onblur = function () {
                        validate(inputElement, rule);
                    }

                    // khi user nhap vao input
                    inputElement.oninput = function () {
                        console.log(inputElement.value);

                        if (inputElement.value.trim() !== '') {
                            console.log('enter name successfully!');
                            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                            //console.log(inputElement.parentElement.querySelector(options.errorSelector).innerText);
                            getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector).innerText = '';

                        }
                    }


                }
            });

        });

        console.log(selectorRules);

    }


}

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            return value ? undefined : message || 'Please enter this field!';

        }
    };

}


Validator.isEmail = function (selector, message) {

    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Please enter email!';

        }
    };

}

Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Please enter least ${min} characters!`;
        }
    }
}

Validator.isConfirmPassword = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Vui long nhap lai password!';

            // neu value bang cofirm value thi khong co loi
        }
    }

}




Validator({
    form: '#form-1',
    formGroupSelector: '.form-group',
    errorSelector: '.form-message',
    rules: [
        Validator.isRequired('#name', 'Name is invalid. Please enter again!'),
        Validator.isRequired('#email'),
        Validator.isEmail('#email', 'Email nhap vao khong chinh xac!'),
        Validator.minLength('#password', 6, 'Password is invalid!'),
        //Validator.isRequired('#confirm-password'),
        // Validator.isConfirmPassword('#confirm-password', function () {
        //   return document.querySelector('#form-1 #password').value;
        // }, 'Password nhap lai khong chinh xac!'),
        // Validator.isRequired('#province'),
        Validator.isRequired('#phone'),
        Validator.minLength('#phone', 9, 'Phone number is invalid!'),

    ],
    onSubmit: function (data) {
        console.log(data);
        console.log(typeof data);

        if (typeof data == 'object') {
            console.log('success');

            var inforElement = document.querySelector('#infor');
            console.log(inforElement);
           
            inforElement.innerHTML = `
            <td>${data.name}</td>
            <td>${data.email}</td>
            <td>${data.password}</td>
            <td>${data.phone}</td>
            <td>
                    <a href="#" onclick="update()">edit</a> |
                    <a style="color: #f2796e" href="#" onclick="remove()">delete</a>
            </td>
          

            `
        }


    },


});

function remove() {

}

function update() {
    
}

var app = angular.module('app', []);

app.controller('MainController', function () {

    var vm = this;
    vm.new = {};

    vm.shows = [
        {
            name: 'Vu Thi Thao Giang',
            email: 'thaogiang@gmail.com',
            password: '123456',
            phone: '123456789',
            id: 0
        },
        {
            name: 'Nguyen Van Hoa',
            email: 'hoanguyen@gmail.com',
            password: '04903848',
            phone: '29354365',
            id: 1
        },
        {

            name: 'Nguyen Thi Thu THanh',
            email: 'thanhnuyen@gmil.com',
            password: 'djsdgsk',
            phone: '09304797735',
            id: 2

        },
        {
            name: 'Hoang Thuy Quynh',
            email: 'quynh@gmail.com',
            password: '111111',
            phone: '3948935745',
            id: 3
        }
        ,
        {
            name: 'John Time',
            email: 'example@gmail.com',
            password: '1234553',
            phone: '23u489',
            id: 4
        },
        {
            name: 'John Time',
            email: 'example@gmail.com',
            password: '1234553',
            phone: '23u489',
            id: 5
        }, {
            name: 'John Time',
            email: 'example@gmail.com',
            password: '1234553',
            phone: '23u489',
            id: 6
        }, {
            name: 'John Time',
            email: 'example@gmail.com',
            password: '1234553',
            phone: '23u489',
            id: 7
        }, {
            name: 'John Time',
            email: 'example@gmail.com',
            password: '1234553',
            phone: '23u489',
            id: 8
        },

    ];

    var uid = 9;

    vm.addShow = function () {
        if (!vm.addForm.$pristine && vm.addForm.$submitted) {
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

