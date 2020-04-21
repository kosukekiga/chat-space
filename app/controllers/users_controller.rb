class UsersController < ApplicationController

  def index
    return nil if params[:keyword] == ""
    @users = User.where('name LIKE ?', "%#{params[:keyword]}%").where.not(id: current_user.id).limit(10)
    # ajax通信の記述:dataTypeの種類に応じて参照するファイルを切り替える
    respond_to do |format|
      format.html
      format.json
      # ajax記述には、dataType: 'json' と書かれているので
      # index.json.jbuilderファイルが読み込まれる
    end
  end
  
  def edit
  end

  def update
    if current_user.update(user_params)
      redirect_to root_path
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email)
  end
end