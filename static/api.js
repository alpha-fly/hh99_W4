// 게시글 조회
function getArticles(callback) {
    $('#articleList').empty();
    $.ajax({
        type: 'GET',
        url: `/api/article`,

        success: function (response) {
            callback(response['articles']);
        },
    });
}

// 게시글 상세 조회
function getArticleDetail(articleId, callback) {
    $.ajax({
        type: 'GET',
        url: `/api/article/${articleId}`,

        success: function (response) {
            callback(response.article);
        },
    });
}

// 게시글 작성
function writeArticle() {
    let articleId;
    let date = new Date();
    let title = $('#title').val();
    let content = $('#content').val();

    $.ajax({
        type: 'POST',
        url: `/api/article/new_article`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
            date,
            user,
            title,
            content,
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                alert('로그인이 필요한 기능입니다.');
            }

            if (xhr.status == 400) {
                alert('제목과 내용을 입력해주세요');
            }

            window.location.reload();
        },
        success: function (response) {
            alert(response['message']);
            window.location.href = '/';
        },
    });
}

// 게시글 삭제
function deleteArticle(articleId) {
    $.ajax({
        type: 'DELETE',
        url: `/api/article/${articleId}`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        error: function (xhr, status, error) {
            if (xhr.status == 400 || xhr.status == 401) {
                alert('작성자만 삭제할 수 있습니다.');
            }
        },
        success: function (response) {
            alert(response['message']);
            window.location.href = '/';
        },
    });
}

// 게시글 수정 페이지로 이동
function revisePage(articleId) {
    $.ajax({
        type: 'GET',
        url: `/api/article/revise_check/${articleId}`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        error: function (xhr, status, error) {
            if (xhr.status == 400 || xhr.status == 401) {
                alert('작성자만 수정할 수 있습니다.');
            }
        },
        success: function (response) {
            window.location.href = 'revise.html?articleId=' + articleId;
        },
    });
}

// 게시글 수정
function reviseArticle(articleId) {
    let title = $('#title').val();
    let content = $('#content').val();

    $.ajax({
        type: 'PUT',
        url: `/api/article/${articleId}`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
            title,
            content,
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                alert('작성자만 수정할 수 있습니다');
            }

            if (xhr.status == 400) {
                alert('제목과 내용을 입력해주세요');
            }

            window.location.reload();
        },
        success: function (response) {
            alert(response['message']);
            window.location.href = '/';
        },
    });
}

// 댓글 조회
function getCommentList(articleId, callback) {
    $.ajax({
        type: 'GET',
        url: `/api/article/comment/${articleId}`,

        success: function (response) {
            callback(response.comments);
        },
    });
}

// 댓글 작성
function comment() {
    let location;
    let date = new Date();
    let mention = $('#comment').val();

    $.ajax({
        type: 'POST',
        url: `/api/article/comment/${articleId}`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
            date,
            mention,
            location,
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                alert('로그인 해주세요.');
            }

            if (xhr.status == 400) {
                alert('댓글 내용을 입력해주세요.');
            }

            window.location.reload();
        },
        success: function (response) {
            alert(response['message']);
            window.location.reload();
        },
    });
}

// 댓글 삭제
function deleteComment(commentId) {
    $.ajax({
        type: 'DELETE',
        url: `/api/article/comment/${commentId}`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                alert('작성자만 삭제할 수 있습니다.');
            }
        },
        success: function (response) {
            alert(response['message']);
            window.location.reload();
        },
    });
}

// 댓글 수정
function reviseComment(commentId) {
    let mention = $('#mention').val();

    $.ajax({
        type: 'PUT',
        url: `/api/article/comment/${commentId}`,
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        data: {
            mention,
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                alert('작성자만 수정할 수 있습니다.');
            }

            if (xhr.status == 400) {
                alert('댓글 내용을 입력해주세요.');
            }
            window.location.reload();
        },
        success: function (response) {
            alert(response['message']);
            window.location.reload();
        },
    });
}

// 로그인 체크
function getSelf(callback) {
    $.ajax({
        type: 'GET',
        url: '/api/user/me',
        headers: {
            authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        success: function (response) {
            callback(response.user);
        },
        error: function (xhr, status, error) {
            if (xhr.status == 401) {
                alert('로그인이 필요합니다.');
            } else {
                localStorage.clear();
                alert('알 수 없는 문제가 발생했습니다. 관리자에게 문의하세요.');
            }
            window.location.href = '/';
        },
    });
}

// 로그인
function sign_in() {
    let id = $('#inputid').val();
    let password = $('#inputPassword').val();

    $.ajax({
        type: 'POST',
        url: '/api/user/auth',
        data: {
            id: id,
            password: password,
        },
        success: function (response) {
            localStorage.setItem('token', response.token);
            window.location.replace('/articles.html');
        },
        error: function (error) {
            customAlert(error.responseJSON.errorMessage);
        },
    });
}

// 회원가입
function sign_up() {
    const id = $('#inputid').val();
    const nickname = $('#inputNickname').val();
    const password1 = $('#inputPassword1').val();
    const password2 = $('#inputPassword2').val();

    $.ajax({
        type: 'POST',
        url: '/api/user/new_user',
        data: {
            id: id,
            nickname: nickname,
            password: password1,
            confirmPassword: password2,
        },
        success: function (response) {
            customAlert('회원가입을 축하드립니다!', function () {
                window.location.replace('/');
            });
        },
        error: function (error) {
            customAlert(error.responseJSON.errorMessage);
        },
    });
}

// 로그아웃
function signOut() {
    localStorage.clear();
    alert('로그아웃 하셨습니다.');
    window.location.href = '/';
}
