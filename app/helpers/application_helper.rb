module ApplicationHelper
  def javascript_include_tag(*sources)
    if Rails.env.development?
      opts = {
        src: 'http://localhost:8080/bundle.js'
      }
      return content_tag(:script, '', opts)
    end
    super(*sources)
  end
end
