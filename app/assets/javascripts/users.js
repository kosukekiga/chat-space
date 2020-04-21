$(function() {       //以下の処理を読み込ませるための必須記述
  function addUser(user) {
    let html = `
      <div class="chat-group-user clearfix">
        <p class="chat-group-user__name">${user.name}</p>
        <div class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${user.id}" data-user-name="${user.name}">追加</div>
      </div>
    `;
    $("#user-search-result").append(html);
  }

  function addNoUser() {
    let html = `
      <div class="chat-group-user clearfix">
        <p class="chat-group-user__name">ユーザーが見つかりません</p>
      </div>
    `;
    $("#user-search-result").append(html);
  }
  //削除ボタンの書いてあるhtmlを呼び出す処理
  function addDeleteUser(name, id) {
    let html = `
      <p class="chat-group-user__name">${name}</p>
      <div class="user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn" data-user-id="${id}" data-user-name="${name}">削除</div>
    </div>`;
    //作ったhtmlをぶち込む
    $(".js-add-user").append(html);
  }
  //ユーザーをグループに登録するための処理
  function addMember(userId) {
    //userのidをinputタグの初期値としそれをnameを使ってgroupsコントローラ内のparamsで受け取る準備
    let html = `<input value="${userId}" name="group[user_ids][]" type="hidden" id="group_user_ids_${userId}" />`;
    //作ったinputタグをaddDeleteUser内で作ったhtml内にぶち込む
    $(`#${userId}`).append(html);
  }
  $("#user-search-field").on("keyup", function() {
    let input = $("#user-search-field").val();
    $.ajax({
      type: "GET",                //type     = HTTPメソッドを指定する
      url: "/users",              //url      = パス(URI or Prefix)を指定する
      data: { keyword: input },   //data     = コントローラへ送りたいデータ
      dataType: "json"            //dataType = コントローラが返すファイルの形式
    })
      //変換完了
      .done(function(users) {
        $("#user-search-result").empty();

        if (users.length !== 0) { //検索にヒットした情報が1件以上だった
          // 返されたjsonデータの個数分処理を繰り返す
          users.forEach(function(user) {
            //一人一人のユーザー情報(user)をブラウザに表示する任意のメソッド
            addUser(user);
          });
        } else if (input.length == 0) {
          return false;
        } else {
          addNoUser();
        }
      })
      //変換失敗
      .fail(function() {
        alert("通信エラーです。ユーザーが表示できません。");
      });
  });
  //追加ボタンがクリックされた時の処理を記述する
  $(document).on("click", ".chat-group-user__btn--add", function() {
    //クリックされたところのデータを取得し各変数に代入
    const userName = $(this).attr("data-user-name");
    const userId = $(this).attr("data-user-id");
    //クリックされたところのhtmlを親要素をごと消す（検索結果から消す）
    $(this)
      .parent()
      .remove();
    //削除ボタンの書いてあるhtmlを呼び出す処理に飛ばす
    addDeleteUser(userName, userId);
    //ユーザーをグループに登録するための処理に飛ばす
    addMember(userId);
  });
  $(document).on("click", ".chat-group-user__btn--remove", function() {
    //クリックされたところのhtmlを親要素をごと消す（検索結果から消す）
    $(this)
      .parent()
      .remove();
  });
});