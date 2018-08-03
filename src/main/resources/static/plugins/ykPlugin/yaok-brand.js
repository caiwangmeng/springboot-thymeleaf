/******
 * yaok-brand 的JS
 * */


/**
 *
 * @param form form 表單
 * @param params btp_table的params
 * @returns {*}
 */
function yk_getbtpTableParamsJson(form, params) {
    //var o = {};
    var a = $(form).serializeArray();
    $.each(a, function () {
        if (params[this.name] !== undefined) {
            if (!params[this.name].push) {
                params[this.name] = [params[this.name]];
            }
            params[this.name].push(this.value || '');
        } else {
            params[this.name] = this.value || '';
        }
    });
    return params;
};


function yk_getOssPictureDTOListByUrl(url) {
    var ossPictureDtoList = [];
    var ossPict = {
        pic_content :"",
        pic_file_name :"common",
        pic_upload_file_name :"common",
        sort : 0
    };
    ossPict.pic_content =url;
    ossPictureDtoList.push(ossPict);
    return ossPictureDtoList;
};


function yk_isNul(str){
    return str == null ||str==undefined ||str =="" ;
}

