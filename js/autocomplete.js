/**
 * @author rozhniev
 * Библиотека для создания АвтоКомплита для переданного в конструктор инпута
 *
 * id | string | input id
 * @constructor
 */
Backbone.AutoComplete = function(id)
{
    // ссылка на самого себя
    var self = this;

    // селектор инпута, к которому будем добавлять АвтоКомплит
    self.inputSelector = id;

    // приклеим timestamp к нашим классам для уникальности
    self.timestamp = new Date().getTime();

    // кусок HTML для добавления автокомплита
    self.acHtml = '<div class="ac_wrapper ac_wrapper_' + self.timestamp
        + '" ><ul class="ac_drop_block ac_drop_' + self.timestamp + '"></ul></div>';

    // селектор контейнера автокомплита
    self.acWrapperId = '.ac_wrapper_' + self.timestamp;

    // селектор самого выпадающего списка
    self.acDropId = '.ac_drop_'+self.timestamp;

    // подсвеченный на данный момент элемент в выпадающем списке
    self.dropDownSelected = 0;

    // максимальное кол-во элементов в выпадающем списке (начинается с 0)
    self.dropDownMax = 4;

    // константа - кнопка курсор вниз
    self.downKey = 0;

    // константа - кнопка курсор вверх
    self.upKey = 1;

    // html кэш выпадающего списка
    self.dropDownCache = null;

    // уже выбранные получатели
    self.selectedReceivers = {};

    // начальный (общий) массив получателей
    self.usersData = [
        {
            "lastName": "Chapiuk",
            "email": "razorch@ukr.net"
        },
        {
            "firstName": "Andrei",
            "lastName": "Stahovich",
            "email": "stahovich@ukr.net"
        },
        {
            "firstName": "Panas",
            "lastName": "Klinskiy",
            "email": "astarok@ukr.net"
        },
        {
            "firstName": "Nikolai",
            "lastName": "Dubliskiy",
            "email": "dub@ukr.net"
        },
        {
            "firstName": "Vasiliy",
            "lastName": "Stasiev",
            "email": "stasiev@ukr.net"
        },
        {
            "firstName": "Vladimir",
            "lastName": "Pugovkin",
            "email": "pugovochka@ukr.net"
        },
        {
            "firstName": "Dmitriy",
            "lastName": "Nagiev",
            "email": "bald@ukr.net"
        },
        {
            "lastName": "Chehova",
            "email": "chehova@ukr.net"
        },
        {
            "firstName": "Bill",
            "lastName": "Clinton",
            "email": "billy@ukr.net"
        },
        {
            "firstName": "Vitaliy",
            "lastName": "Chymovoy",
            "email": "chymak@ukr.net"
        },
        {
            "firstName": "Dmitriy",
            "lastName": "Rozhniev",
            "email": "rozhniev@mti.ua"
        },
        {
            "firstName": "Anna",
            "lastName": "Akimova",
            "email": "ann@ukr.net"
        },
        {
            "lastName": "Pasternak",
            "email": "larry@ukr.net"
        },
        {
            "firstName": "Oles",
            "lastName": "Pelmeniev",
            "email": "eda@ukr.net"
        },
        {
            "firstName": "Otto",
            "lastName": "Shoultz",
            "email": "shoultz@ukr.net"
        },
        {
            "firstName": "Nikita",
            "email": "nik@ukr.net"
        },
        {
            "firstName": "Aleksey",
            "lastName": "Smirnov",
            "email": "alex@ukr.net"
        },
        {
            "firstName": "Sergey",
            "lastName": "Bashlakov"
        },
        {
            "email": "panov@ukr.net"
        },
        {
            "firstName": "Vitaliy",
            "lastName": "Dikiy",
            "email": "dikiy@ukr.net"
        },
        {
            "firstName": "Zinaida",
            "lastName": "Ohmonek",
            "email": "ohmonek@ukr.net"
        },
        {
            "firstName": "Maria",
            "lastName": "Rozhnieva",
            "email": "masha@ukr.net"
        },
        {
            "firstName": "Silvester",
            "lastName": "Standalone",
            "email": "rambo@ukr.net"
        },
        {
            "firstName": "Amid",
            "lastName": "Gusiev",
            "email": "ytka@ukr.net"
        },
        {
            "firstName": "Stanislav",
            "lastName": "Zhuravliev"
        },
        {
            "firstName": "Kreig",
            "lastName": "Luter",
            "email": "kl@ukr.net"
        },
        {
            "firstName": "Evgeniy",
            "lastName": "Nikiforov",
            "email": "nikiforov@ukr.net"
        },
        {
            "firstName": "Mustafa",
            "lastName": "Serebrennikov",
            "email": "silver@ukr.net"
        },
        {
            "firstName": "Harry",
            "email": "goldy@ukr.net"
        },
        {
            "firstName": "Zak",
            "lastName": "Shtein",
            "email": "shtein@ukr.net"
        },
        {
            "firstName": "Nikolai",
            "lastName": "Rudchenko"
        },
        {
            "firstName": "Violetta",
            "email": "viola@ukr.net"
        },
        {
            "lastName": "Messner",
            "email": "messner@ukr.net"
        },
        {
            "firstName": "Taras",
            "lastName": "Prichepko",
            "email": "tarik@ukr.net"
        },
        {
            "firstName": "Austin",
            "lastName": "Noel",
            "email": "noel@ukr.net"
        },
        {
            "firstName": "Stanislav",
            "lastName": "Voitenko",
            "email": "wowleg@ukr.net"
        }
    ];


    // проверка переданного в конструктор инпута
    self.isValidId = function()
    {
        var el = $(self.inputSelector);

        if ( el.length < 1 )
        {
            console.log('Ошибка! HTML элемент по переданному id не найден!');
            return false;
        }
        else if ( el.length > 1 )
        {
            console.log('Ошибка! По переданному id найдено более одного HTML элемента!');
            return false;
        }

        return true;
    };

    if ( ! self.isValidId() )
        return false;


    // объявление структуры библиотеки
    self.Models = {};
    self.Collections = {};
    self.Views = {};


    // объявление модели пользователя
    self.Models.User = Backbone.Model.extend({

        defaults: {
            firstName: '',
            lastName: '',
            email: '',
            firstNameHtml: '',
            lastNameHtml: '',
            emailHtml: ''
        },

        // пользователи не прошедшые валидацию отбрасываются
        initialize: function() {
            return this.isValid();
        },

        // сама валидация пользователя
        validate: function (attrs) {
            if ( ! attrs.email ) {
                return 'Please fill email field.';
            }
        }
    });


    // объявление коллекции пользоватей
    self.Collections.User = Backbone.Collection.extend({
        model: self.Models.User,
        url: 'data/users.json' // по урлу за данными не ходим (см. readme)
    });


    // данные не фетчим из урла, а берём из массива (см. readme)
    //self.users = new self.Collections.User();
    //self.users.fetch();


    // вьюха самого автокомплита
    self.Views.AutoComplete = Backbone.View.extend({

        /**
         * описываем обработчики событий автокомплита
         * @returns {{}}
         */
        events: function()
        {
            var _events = {};
            _events["click"] = "containerClick";
            _events["keyup " + self.inputSelector] = "inputKeyUp";
            _events["keydown " + self.inputSelector] = "inputKeyDown";
            _events["blur " + self.inputSelector] = "inputBlur";
            _events["mouseenter " + self.acDropId+' li'] = "liHover";
            _events["mousedown " + self.acDropId+' li'] = "liMouseDown";
            _events["click " + '.user_del_button'] = "deleteReceiver";
            return _events;
        },

        /**
         * при потере фокуса инпута убираем выпадающий список
         */
        inputBlur: function()
        {
            setTimeout(self.clearDropDown, 200);
        },

        /**
         * при mousedown на элементе выпадающего списка добавляем нажатого
         * пользователя в получатели, убираем выпад. список и чистим инпут
         * @param e
         */
        liMouseDown: function(e)
        {
            var item = $(e.currentTarget);
            self.addReceiver(item);
        },

        /**
         * при нажатии на крестик на получателе - удаляем его из получателей
         * и из массива, где мы запоминаем уже выбранных получателей
         * @param e
         */
        deleteReceiver: function(e)
        {
            var receiver = $(e.currentTarget).parent('.user_added_block');
            var email = receiver.find('input[type=hidden]').val();

            if ( typeof self.selectedReceivers[email] != 'undefined' )
                delete self.selectedReceivers[email];

            receiver.remove();
        },

        /**
         * при наведении курсора на эл. выпад списка даём ему класс
         * selected и убираем его для всех остальных эл. списка
         * @param e
         */
        liHover: function(e)
        {
            var itemToSelect = $(e.currentTarget);
            var index = itemToSelect.data('index');
            var items = $(self.acDropId + ' li');

            items.each(function()
            {
                $(this).removeClass('selected');
            });

            itemToSelect.addClass('selected');
            self.dropDownSelected = index;
        },

        /**
         * при клике в любом месте на контейнере автокомплита даём фокус инпуту
         */
        containerClick: function()
        {
            $(self.inputSelector).focus();
        },

        /**
         * при keydown BACKSPACE в инпуте и отсутствии текста в нём удаляем
         * последнего созданного получателя визуально и из массива
         * @param e
         */
        inputKeyDown: function(e)
        {
            if ( e.which == 8 ) // BACKSPACE
            {
                var text = $(self.inputSelector).val();

                if ( $.trim(text).length == 0 )
                {
                    var receiver = $(self.acWrapperId + ' .user_added_block').last();
                    var email = receiver.find('input[type=hidden]').val();

                    if ( typeof self.selectedReceivers[email] != 'undefined' )
                        delete self.selectedReceivers[email];

                    receiver.remove();
                }
            }
        },

        /**
         * при keyup в инпуте происходит много чего (см. комментарии внутри)
         * @param e
         * @returns {boolean}
         */
        inputKeyUp: function(e)
        {
            var index,
                selItem,
                acDropId = $(self.acDropId);

            // при нажатии на ENTER
            if ( e.which == 13 ) // ENTER
            {
                var selectedItem = $(self.acDropId + ' li.selected');

                // если не выделен ни один эл. выпад. списка
                if ( selectedItem.length < 1 )
                {
                    // выделяем первый
                    self.selectDropDownItem(0);
                    return false;
                }
                else
                {
                    // добавляем выбранного польз. в получатели
                    self.addReceiver(selectedItem);
                    self.clearDropDown();
                    return false;
                }
            }
            // при нажатии курсора вниз
            else if ( e.which == 40 ) // KEY DOWN
            {
                selItem = $(self.acDropId + ' li.selected');

                // если не выделен ни один эл. выпад списка
                if ( selItem.length < 1 )
                {
                    // выделяем первый элемент
                    self.selectDropDownItem(0, self.downKey);
                    return false;
                }
                else
                {
                    // выделяем тот что ниже выделенного
                    index = selItem.data('index');
                    self.selectDropDownItem(++index, self.downKey);
                    return false;
                }
            }
            // при нажатии на курсор вверх
            else if ( e.which == 38 ) // KEY UP
            {
                selItem = $(self.acDropId + ' li.selected');

                // если не выделено ни одного эл. выпад. списка
                if ( selItem.length < 1 )
                {
                    // передаем выделение последнему
                    self.selectDropDownItem(self.dropDownMax, self.upKey);
                    return false;
                }
                else
                {
                    // передаём выделение тому что выше выделенного
                    index = selItem.data('index');
                    self.selectDropDownItem(--index, self.upKey);
                    return false;
                }
            }

            var count = 0;
            var search = e.target.value.toLowerCase();

            // если длина введённого текста == 0
            if ( search.length < 1 )
            {
                // убираем выпад. список
                self.clearDropDown();
                return false;
            }

            // создаём коллекцию с пользователями
            var users = new self.Collections.User(self.usersData);

            // поиск по коллекции пользователей нужного по поисковому слову
            var items = users.filter(function(item)
            {
                // если уже выбрали 5 пользователей - хватит
                if ( count >= 5 )
                    return false;

                var isFound = false;
                var part1, part2, label;

                // поиск по эмейлу
                if ( item.get('email').toLowerCase().indexOf(search) === 0 )
                {
                    part1 = item.get('email').substr(0,search.length);
                    part2 = item.get('email').substr(search.length);
                    label = '<span class="highlighted">'+part1+'</span>'+part2;
                    item.set({emailHtml:label});
                    isFound = true;
                }
                // поиск по имени
                if ( item.get('firstName').toLowerCase().indexOf(search) === 0 )
                {
                    part1 = item.get('firstName').substr(0,search.length);
                    part2 = item.get('firstName').substr(search.length);
                    label = '<span class="highlighted">'+part1+'</span>'+part2;
                    item.set({firstNameHtml:label});
                    isFound = true;
                }
                // поиск по фамилии
                if ( item.get('lastName').toLowerCase().indexOf(search) === 0 )
                {
                    part1 = item.get('lastName').substr(0,search.length);
                    part2 = item.get('lastName').substr(search.length);
                    label = '<span class="highlighted">'+part1+'</span>'+part2;
                    item.set({lastNameHtml:label});
                    isFound = true;
                }

                // если найдено совпадение
                if ( isFound )
                {
                    // проверяем в массиве уже выбранных получателей
                    if ( typeof self.selectedReceivers[ item.get('email') ] != 'undefined' )
                        return false;

                    ++count;
                    return true;
                }
            });

            var html = '';
            index = 0;

            // если пользователи по поиск. слову не найдены
            if ( items.length < 1 )
            {
                // убираем выпадающий список
                self.clearDropDown();
                return false;
            }

            // сортируем выбранных пользователей в алфавитном порядке по имени
            items = items.sort(function(a, b)
            {
                a = a.get('firstName');
                b = b.get('firstName');
                return a > b ? 1  :  a < b ? -1  :  0;
            });

            // для набора найденных по поиску пользователей
            items.forEach(function(item)
            {
                // создаём HTML элементы (код)
                html += self.makePerson(item,index);
                ++index;
            });

            // если сгенерированный HTML код = кэшу (последнему сгенерированному HTML коду)
            // и выпадающий список отображен и не пустой
            if ( self.dropDownCache == html && acDropId.html() != '' )
                return false; // тогда всё оставляем как есть

            // помещаем HTML код элементов выпад. списка в сам список и отображаем его
            acDropId.html(html).show();

            // помещаем HTML код элементов выпад. списка в кэш
            self.dropDownCache = html;
        }

    });


    /**
     * Добавление получателя. Генерация HTML кода объекта получателя и добавление
     * его прямо перед инпутом. Так же помещение получателя в массив получателей.
     * @param item
     */
    self.addReceiver = function(item)
    {
        var firstname = item.data('firstname');
        var lastname = item.data('lastname');
        var email = item.data('email');

        var html = '<div class="user_added_block">'
            + '<span class="user_added_name">'
            + firstname + ' ' + lastname + '</span>'
            + '<input type="hidden" name="user_added[]" value="' + email + '">'
            + '<span class="user_del_button"></span> </div>';

        var el = $(self.inputSelector);
        el.before(html);
        self.clearDropDown();
        self.clearInput();
        self.selectedReceivers[email] = {
            firstName: firstname,
            lastName: lastname
        };

        setTimeout(function() { el.focus() }, 200);
    };

    /**
     * Удерживает индекс (0-4) для элемента выпадающего списка в рамках нормы
     * @param index
     * @returns {*}
     */
    self.checkIndex = function(index)
    {
        if ( index > self.dropDownMax )
            index = 0;
        else if ( index < 0 )
            index = self.dropDownMax;
        return index;
    };

    /**
     * Выделяет эл. выпад. списка по заданному индексу
     * @param index
     * @param key
     */
    self.selectDropDownItem = function(index,key)
    {
        var selected = false;
        var items = $(self.acDropId + ' li');
        index = self.checkIndex(index);

        items.each(function()
        {
            var item = $(this);

            if ( item.data('index') == index )
            {
                selected = true;
                item.addClass('selected');
            }
            else
                item.removeClass('selected');
        });

        if ( ! selected )
        {
            if ( key == self.downKey )
                items.first().addClass('selected');
            else if ( key == self.upKey )
                items.last().addClass('selected');
        }

        self.dropDownSelected = index;
    };


    /**
     * чистит содержимое инпута
     */
    self.clearInput = function()
    {
        $(self.inputSelector).val('');
    };

    /**
     * чистит и прячет выпадающий список
     */
    self.clearDropDown = function()
    {
        $(self.acDropId).html('').hide();
    };

    /**
     * Возвращает HTML код элемента выпадающего списка на основе переданной модели пользователя
     * @param item
     * @param index
     * @returns {string}
     */
    self.makePerson = function(item,index)
    {
        return '<li data-index="' + index
            + '" data-firstname="' + item.get('firstName')
            + '" data-lastname="' + item.get('lastName')
            + '" data-email="' + item.get('email') + '">'
            + ( item.get('firstNameHtml') ? item.get('firstNameHtml') : item.get('firstName') ) + ' '
            + ( item.get('lastNameHtml') ? item.get('lastNameHtml') : item.get('lastName') )
            + '<br><i>' + ( item.get('emailHtml') ? item.get('emailHtml') : item.get('email') ) + '</i>';
    };

    /**
     * Стартовый метод. Находит переданный в конструктор инпут. Вставляет перед ним
     * контейнер для автокомплита и пустой выпадающий список. Переносит сам инпут
     * в контейнер и добавляет инпуту свой стилистический класс. По факту: создаёт автокомплит.
     */
    self.init = function()
    {
        var el = $(self.inputSelector);
        el.before(self.acHtml);
        $(self.acDropId).before(el);
        el.addClass('ac_input');

        self.acView = new self.Views.AutoComplete({
            el: $(self.acWrapperId)
        });

        self.acView.render();
    };


    self.init();

    return this;
};





