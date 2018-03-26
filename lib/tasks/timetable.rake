namespace :timetable do
  task main: :environment do
    # abort if Time.zone.now >= Time.zone.local(2017, 8, 28)

    days = {
      Date.new(2017, 8, 26) => 'https://leadi.jp/json/14680.json',
      Date.new(2017, 8, 27) => 'https://leadi.jp/json/14681.json'
    }
    results = []
    days.each do |day, url|
      open(url) do |f|
        JSON.parse(f.read)['data']['timetables'].each do |e|
          stage = e['stage']
          color = e['color']
          e['turns'].each do |turn|
            start_time = Time.zone.strptime("#{day} #{turn['start'].rjust(4, '0')}", '%Y-%m-%d %H%M')
            end_time   = Time.zone.strptime("#{day} #{turn['end'].rjust(4, '0')}",   '%Y-%m-%d %H%M')
            detail = turn['replacement']
            stage_key = {
              'ストロベリーステージ' => 'strawberry',
              'ブルーベリーステージ' => 'blueberry',
              'オレンジステージ'     => 'orange',
              'グレープステージ'     => 'grape',
              'キウイステージ'       => 'kiwi',
              'ピーチステージ'       => 'peach',
              'パイナップルステージ' => 'pinapple',
              'トークステージ'       => 'talk',
              'ふれあいエリアA'      => 'greeting',
              'ふれあいエリアB'      => 'greeting'
            }[stage]
            if stage_key == 'greeting'
              turn['lineup'].each do |item|
                results << {
                  id: "#{turn['id']}-#{item['id']}",
                  artist: item['name'],
                  detail: detail,
                  start: start_time,
                  end: end_time,
                  stage: stage,
                  color: color,
                  stage_key: stage_key
                }
              end
            else
              artist = turn['lineup'].map { |l| l['name'] }.join('、')
              results << {
                id: turn['id'],
                artist: artist,
                detail: detail,
                start: start_time,
                end: end_time,
                stage: stage,
                color: color,
                stage_key: stage_key
              }
            end
          end
        end
      end
    end
    results.sort_by!.with_index { |v, i| [v[:start], i] }
    Rails.cache.write('main', results)
  end
end
