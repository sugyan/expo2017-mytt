class ApiController < ApplicationController
  def timetable
    @data = all_data
  end

  def generate
    png = generate_image
    render json: { result: "data:image/png;base64,#{Base64.strict_encode64(png)}" }
  end

  def tweet
    png = generate_image
    tweet = Tempfile.open do |f|
      f.binmode
      f.write(png)
      f.rewind
      twitter_client.update_with_media('', f)
    end
    result = Timetable.create(
      key: SecureRandom.hex(4),
      data: params['ids'].to_json,
      url: tweet.media.first.display_url
    )
    render json: { key: result.key, url: result.url }
  end

  private

  def all_data
    Rails.cache.read('main') || []
  end

  # rubocop: disable Metrics/MethodLength, Metrics/AbcSize
  def generate_image
    items = all_data.select do |item|
      params[:ids].include?(item[:id])
    end
    days = items.map do |item|
      item[:start].to_date
    end.uniq
    images = days.map do |day|
      title = Magick::Image.new(550, 35)
      Magick::Draw.new.annotate(title, 0, 0, 0, 0, I18n.l(day)) do
        self.font = Rails.root.join('.fonts', 'ipagp.ttf').to_path
        self.pointsize = 15
        self.gravity = Magick::CenterGravity
      end
      rows = items.select { |item| item[:start].to_date == day }.map do |item|
        time = format(
          '%s - %s',
          item[:start].in_time_zone.strftime('%H:%M'),
          item[:end].in_time_zone.strftime('%H:%M')
        )
        img = Magick::Image.new(550, 35) do
          self.background_color = item[:color]
        end
        Magick::Draw.new.fill('white').roundrectangle(5, 5, 545, 30, 5, 5).draw(img)
        Magick::Draw.new.annotate(img, 0, 0, 10, 24, time) do
          self.pointsize = 15
        end
        Magick::Draw.new.annotate(img, 0, 0, 100, 24, format('[%s]', item[:stage])) do
          self.font = Rails.root.join('.fonts', 'ipagp.ttf').to_path
          self.pointsize = 15
        end
        artist = item[:artist].presence || item[:detail]
        Magick::Draw.new.annotate(img, 0, 0, 260, 24, artist.tr("\n", ' ')) do
          self.font = Rails.root.join('.fonts', 'ipagp.ttf').to_path
          self.font_weight = Magick::BoldWeight
          self.pointsize = 15
        end
        img
      end
      Magick::ImageList.new.push(title).concat(rows).append(true)
    end
    Magick::ImageList.new.concat(images).append(true).to_blob do
      self.format = 'PNG'
    end
  end

  def twitter_client
    Twitter::REST::Client.new do |config|
      config.consumer_key        = ENV['TWITTER_CONSUMER_KEY']
      config.consumer_secret     = ENV['TWITTER_CONSUMER_SECRET']
      config.access_token        = ENV['TWITTER_ACCESS_TOKEN']
      config.access_token_secret = ENV['TWITTER_ACCESS_TOKEN_SECRET']
    end
  end
end
