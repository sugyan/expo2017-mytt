class RootController < ApplicationController
  def index; end

  def tt
    @result = Timetable.find_by(key: params[:key])
    render :index
  end
end
