
// 性能好，动态的选择器
function MsId(a) {
	return document.getElementById(a);
}

function MsClass(a) {
	return document.getElementsByClassName(a).length == 1 ? document.getElementsByClassName(a)[0] : document.getElementsByClassName(a);
}

function MsClassAll(a) {
	return document.getElementsByClassName(a);
}


// 好用，全面的元素选择器
function Ms(a) {
	return document.querySelectorAll(a).length == 1 ? document.querySelector(a) : document.querySelectorAll(a);
}

function MsAll(a) {
	return document.querySelectorAll(a);
}


function Mindex(a) {
	for (var i = a.length - 1; i >= 0; i--) {
		a[i].index = i;
	}
}




// 开始

var list = JOSN.parse(localStorage.getItem('test')) || []; //存tips 读缓存
var sortDepend = 0;

if (localStorage.getItem('test')) refresh;
/*
*******************************    插入, 修改
*/
Object.defineProperty(list, 'chessIn', {
    get: _=>list,
    set: (value) => {
        if(value) {
            list.push(value);
        }
        list.sort(function (a, b) {
            if (sortDepend == 1) {
                return b.standard - a.standard;
            }
            else if (sortDepend == 0) {
                return a.index - b.index;
            }
        });
        localStorage.setItem('test', JSON.stringify(list));
        refresh();
        return list.length;
    }
})
// 渲染函数
var shua = (data) => {
    shua.x = shua.tem.replace(/\{\{(.*?)\}\}/g, (a, b) => {
            return data[b];
    }).replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    return shua.x;
}
shua.tem = shua.tem || Ms('#tem1').innerHTML; //获取模版

var refresh = _=> {
    Ms('#l').innerHTML = '';
    list.forEach((a, b, c) => {
        Ms('#l').innerHTML += shua(a);
    })
    Ms('.btn div span').innerHTML = list.length;
}
var makeTip = function (a, b) {
    this.isDid = '1';   //我太垃圾了
    this.name = a;
    this.time = (new Date()).toLocaleString();
    this.index = (new Date()).getTime().toString();
    this.standard = b;
}  //tips构造函数
var inp = Ms('#inp');
inp.addEventListener('change', (event) => {
    var info = event.target.value;
    list.chessIn = new makeTip(info, Number(Ms('#sel').value[1]));
})


/*
*******************************    筛选，修改
*/
Ms('#l').addEventListener('click', (event) => {
    var tg = event.target,
        art = tg.parentNode;
    console.log(art);
    if (tg.nodeName.toLowerCase() === 'div') { // 点击完成
        event.target.className = 'AA';
        window.list.forEach((a, b, c) => {
            if (a.index == art.getAttribute('index')) {
                a.isDid = a.isDid == 'line-through' ? '1' : 'line-through';
            }
        })
        refresh();
    }
    else if (tg.innerHTML === '去除') {
        art.outerHTML = '';
        window.list.forEach((a, b, c) => {
            if (a.index == art.getAttribute('index')) {
                delete c[b];
            }
        })
        refresh();
    }
    else if (tg.innerHTML === '修改') {
        art.contentEditable = true;
        window.onkeyup = function () {
            window.list.forEach((a, b, c) => {
                if (a.index == art.getAttribute('index')) {
                    a.name = art.getElementsByTagName('p')[0].innerHTML;
                }
            })
        }
    }
})

/*
*******************************    切换类型
*/
var changeXBtn = Array.prototype.slice.call(MsAll('.btn div'), 1, 4);
changeXBtn.forEach((a, b, c) => {
    a.addEventListener('click', (event) => {
        changeXBtn.forEach((a)=>a.className = '');
        a.className = 'ACTIVE';
        if (b == 0) {
            refresh();
        }
        else if (b == 1) {
            refresh();
            MsAll('.list').forEach((a, b, c) => {
                if (a.style.textDecoration != 'line-through') {
                    a.style.display = 'none';
                }
            })
        }
        else if (b == 2) {
            refresh();
            MsAll('.list').forEach((a, b, c) => {
                if (a.style.textDecoration == 'line-through') {
                    a.style.display = 'none';
                }
            })
        }
    })
})

/*
*******************************    切换排序方法
*/
Ms('#youxianji').addEventListener('click', function () {
    Ms('#shijian').className = '';
    this.className = 'ACTIVE';
    sortDepend = 1;
    list.chessIn = false;
})
Ms('#shijian').addEventListener('click', function () {
    Ms('#youxianji').className = '';
    this.className = 'ACTIVE';
    sortDepend = 0;
    list.chessIn = false;
})
