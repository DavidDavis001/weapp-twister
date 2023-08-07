export default {
    //排序(随机打乱)
    shuffle(arr) {
        let length = arr.length,
            randomIndex,
            temp;
        while (length) {
            randomIndex = Math.floor(Math.random() * (length--));
            temp = arr[randomIndex];
            arr[randomIndex] = arr[length];
            arr[length] = temp
        }
        return arr;
    },

    contact(arr1, arr2, arr3) {
        if (arguments.length <= 1) {
            return false;
        }
        let concat_ = function (arr1, arr2) {
            let arr = arr1.concat();
            for (let i = 0; i < arr2.length; i++) {
                arr.indexOf(arr2[i]) === -1 ? arr.push(arr2[i]) : 0;
            }
            return arr;
        }
        let result = concat_(arr1, arr2);
        for (let i = 2; i < arguments.length; i++) {
            result = concat_(result, arguments[i]);
        }
        return this.shuffle(result);
    },

    //decodeUnicode(str) {
    //    str = str.replace(/\\/g, "%");
    //    return unescape(str);
    //},

    //generateWord(num) {
    //    let arr = [];
    //    for (let i = 0; i < num; i++) {
    //        let word = '\\u' + (Math.round(Math.random() * 20901) + 19968).toString(16);
    //        arr[i] = this.decodeUnicode(word);
    //    }
    //    // console.log(arr);
    //    return arr;
    //},

    //从一个给定的数组arr中,随机返回num个不重复项
    getArrayItems(arr, num) {
        //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
        let temp_array = new Array();
        for (let index in arr) {
            temp_array.push(arr[index]);
        }
        //数组去重
        let set = new Set(temp_array);
        temp_array = Array.from(set);
        //取出的数值项,保存在此数组
        let return_array = new Array();
        for (let i = 0; i < num; i++) {
            //判断如果数组还有可以取出的元素,以防下标越界
            if (temp_array.length > 0) {
                //在数组中产生一个随机索引
                let arrIndex = Math.floor(Math.random() * temp_array.length);
                //将此随机索引的对应的数组元素值复制出来
                return_array[i] = temp_array[arrIndex];
                //然后删掉此索引的数组元素,这时候temp_array变为新的数组
                temp_array.splice(arrIndex, 1);
            } else {
                //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
                break;
            }
        }

        return this.shuffle(return_array);
    },

    generateArray(length) {
        let arr = [];
        for (let i = 0; i < length; i++) {
            arr[i] = ' ';
        }
        return arr;
    }
}
