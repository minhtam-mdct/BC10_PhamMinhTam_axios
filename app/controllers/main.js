var service = new UserService();
var validation = new Validation();
function getEle(id) {
    return document.getElementById(id);
}

function getData() {
    service.getListUserApi().then(function (result) {
        console.log(result.data);
        rederListUser(result.data);
        getList(result.data);
    }).catch(function (error) {
        console.log(error);
    });
}
getData();

//tạo list tên tài khoản để kiểm tra trùng tài khoản
var listData = [];
function getList(list) {
    list.forEach(function (user) {
        listData.push(user.taiKhoan);

        return listData;
    })
}

function rederListUser(list) {
    var contentHTML = "";
    list.forEach(function (user, index) {
        contentHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${user.taiKhoan}</td>
                <td>${user.matKhau}</td>
                <td>${user.hoTen}</td>
                <td>${user.email}</td>
                <td>${user.ngonNgu}</td>
                <td>${user.loaiND}</td>
                <td>
                <button class="btn btn-info" data-toggle="modal" data-target="#myModal" onclick="editUser(${user.id})">Sửa</button>
                <button class="btn btn-danger" onclick="deleteUser(${user.id})">Xóa</button>
                </td>
            </tr>
            `;
    });
    document.getElementById("tblDanhSachNguoiDung").innerHTML = contentHTML;
}

function checkValid(isAdd, id) {

    var taiKhoan = getEle("TaiKhoan").value;
    var hoTen = getEle("HoTen").value;
    var matKhau = getEle("MatKhau").value;
    var email = getEle("Email").value;
    var loaiND = getEle("loaiNguoiDung").value;
    var ngonNgu = getEle("loaiNgonNgu").value;
    var moTa = getEle("MoTa").value;
    var hinhAnh = getEle("HinhAnh").value;

    var isValid = true;
    if (isAdd) {
        isValid &= validation.kiemTraRong(taiKhoan, "tbTKNV", "Tài khoản không được để trống")
            && validation.kiemTraTrungTK(taiKhoan, "tbTKNV", "Tài khoản đã tồn tại", listData);
    }
    isValid &= validation.kiemTraRong(hoTen, "tbTen", "Họ tên không được để trống") && validation.kiemTraTen(hoTen, "tbTen", "Họ tên không đúng định dạng");

    isValid &= validation.kiemTraRong(email, "tbEmail", "Email không đươc để trống") && validation.kiemTraEmail(email, "tbEmail", "Email không đúng định dạng");

    isValid &= validation.kiemTraRong(matKhau, "tbMatKhau", "Mật khẩu không được để trống") && validation.kiemTraPassWord(matKhau, "tbMatKhau", "Mật khẩu chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt") && validation.kiemTraDoDai(matKhau, "tbMatKhau", "Độ dài tối đa 6-8 ký tự", 6, 8);

    isValid &= validation.kiemTraSelect('loaiNguoiDung', "tbLoaiND", "Hãy chọn loại người dùng") && validation.kiemTraLoaiNDText(loaiND, "tbLoaiND", "Hãy chọn đúng loại người dùng cho phép");

    isValid &= validation.kiemTraSelect('loaiNgonNgu', "tbNgonNgu", "Hãy chọn loại ngôn ngữ");

    isValid &= validation.kiemTraRong(hinhAnh, "tbHinhAnh", "Hình ảnh không được để trống");

    isValid &= validation.kiemTraRong(moTa, "tbMoTa", "Mô tả không được để trống") && validation.kiemTraDoDai(moTa, "tbMoTa", "Độ dài tối đa 60 ký tự", 0, 60)

    if (isValid && isAdd) {
        var user = new Users("", taiKhoan, hoTen, matKhau, email, loaiND, ngonNgu, moTa, hinhAnh);
        return user;
    } if (isValid && isAdd === false) {
        var user = new Users(id, taiKhoan, hoTen, matKhau, email, loaiND, ngonNgu, moTa, hinhAnh);
        return user;
    }
    return null;
}

getEle("btnThemNguoiDung").addEventListener("click", function () {
    document.getElementsByClassName("modal-title")[0].innerHTML = "Thêm User";
    getEle('TaiKhoan').disabled = false;
    var footer = '<button class="btn btn-success" onclick="addUser()" >Thêm User</button>';
    document.getElementsByClassName("modal-footer")[0].innerHTML = footer;
});

function addUser(id) {
    // var taiKhoan = getEle("TaiKhoan").value;
    // var hoTen = getEle("HoTen").value;
    // var matKhau = getEle("MatKhau").value;
    // var email = getEle("Email").value;
    // var loaiND = getEle("loaiNguoiDung").value;
    // var ngonNgu = getEle("loaiNgonNgu").value;
    // var moTa = getEle("MoTa").value;
    // var hinhAnh = getEle("HinhAnh").value;

    // var user = new Users("", taiKhoan, hoTen, matKhau, email, loaiND, ngonNgu, moTa, hinhAnh);
    var user = checkValid(true, id);
    if (user) {
        service
            .addUserApi(user)
            .then(function (result) {
                console.log(result);
                document.getElementsByClassName("close")[0].click();
                getData();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
};

function editUser(id) {
    document.getElementsByClassName("modal-title")[0].innerHTML = "Sửa User";
    getEle('TaiKhoan').disabled = true;
    var footer = `<button class="btn btn-success" onclick="updateUser(${id})" >Sửa</button>`;
    document.getElementsByClassName("modal-footer")[0].innerHTML = footer;

    service
        .getUserByIdApi(id)
        .then(function (result) {
            getEle("TaiKhoan").value = result.data.taiKhoan;
            getEle("HoTen").value = result.data.hoTen;
            getEle("MatKhau").value = result.data.matKhau;
            getEle("Email").value = result.data.email;
            getEle("loaiNguoiDung").value = result.data.loaiND;
            getEle("loaiNgonNgu").value = result.data.ngonNgu;
            getEle("MoTa").value = result.data.moTa;
            getEle("HinhAnh").value = result.data.hinhAnh;
        })
        .catch(function (error) {
            console.log(error);
        })
}

function updateUser(id) {

    // var taiKhoan = getEle("TaiKhoan").value;
    // var hoTen = getEle("HoTen").value;
    // var matKhau = getEle("MatKhau").value;
    // var email = getEle("Email").value;
    // var loaiND = getEle("loaiNguoiDung").value;
    // var ngonNgu = getEle("loaiNgonNgu").value;
    // var moTa = getEle("MoTa").value;
    // var hinhAnh = getEle("HinhAnh").value;

    // var user = new Users(id, taiKhoan, hoTen, matKhau, email, loaiND, ngonNgu, moTa, hinhAnh);
    var user = checkValid(false, id);
    if (user) {
        service.updateUserApi(user)
            .then(function (result) {
                alert("Cập nhật thành công !");
                document.getElementsByClassName("close")[0].click();
                getData();
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

function deleteUser(id) {
    service.deleteUserApi(id)
        .then(function (result) {
            alert("Xóa thành công !");
            getData();
        })
        .catch(function (error) {
            console.log(error);
        });
}

getEle("findTarget").addEventListener("keyup", function () {
    var mangTimKiem = [];
    var findTarget = getEle("findTarget").value;
    service.getListUserApi().then(function (res) {
        res.data.forEach(function (user) {
            if (user.taiKhoan.toLowerCase().indexOf(findTarget.toLowerCase()) !== -1) {
                mangTimKiem.push(user);
            } else {
                if (findTarget === "") {
                    mangTimKiem = res.data;
                }
            }
            rederListUser(mangTimKiem);
        })
    }).catch(function (error) {
        console.log(error);
    })
})

