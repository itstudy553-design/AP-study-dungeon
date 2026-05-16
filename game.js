const SOURCE_NOTE = 'IPA公開過去問題の頻出テーマを参考にしたオリジナル問題です。公式問題をそのまま収録していません。';
const STORAGE_KEY = 'ap_rogue_v4_stats';

const MONSTERS = {
  sql: { name:'SQLインジェクションスライム', image:'assets/monsters/sql_slime.png' },
  dns: { name:'DNSゴースト', image:'assets/monsters/dns_ghost.png' },
  deadlock: { name:'デッドロックゴーレム', image:'assets/monsters/deadlock_golem.png' },
  buffer: { name:'バッファオーバーフロードラゴン', image:'assets/monsters/buffer_dragon.png' },
  audit: { name:'監査ログスペクター', image:'assets/monsters/audit_specter.png' },
  path: { name:'クリティカルパスワーム', image:'assets/monsters/critical_path_worm.png' }
};

const CATEGORY_MONSTER = {
  'セキュリティ':'sql', 'ネットワーク':'dns', 'データベース':'deadlock', 'アルゴリズム':'buffer',
  'プロジェクト管理':'path', 'システム監査':'audit', '経営戦略':'audit'
};
const CATEGORIES = ['セキュリティ','ネットワーク','データベース','アルゴリズム','プロジェクト管理','システム監査','経営戦略'];

const DUNGEONS = [
  { id:'security_net', label:'頻出・基礎固め', name:'セキュリティの城とネットワーク遺跡', description:'認証、暗号、攻撃対策、DNS、TCP/IPなど。午前・午後の両方で効く王道ルート。', categories:['セキュリティ','ネットワーク'] },
  { id:'db_pm', label:'午後対策寄り', name:'DB神殿とプロジェクト坑道', description:'SQL、正規化、トランザクション、WBS、EVM、クリティカルパスをまとめて鍛える。', categories:['データベース','プロジェクト管理'] },
  { id:'strategy_audit', label:'油断しがちな分野', name:'監査の裁判所と経営戦略都市', description:'システム監査、内部統制、SWOT、PPM、損益分岐点などの判断問題に強くなる。', categories:['システム監査','経営戦略'] },
  { id:'mixed', label:'総合', name:'応用情報ランダム迷宮', description:'全分野ランダム。ミニ模試前のウォームアップにおすすめ。', categories:CATEGORIES }
];

const ROOM_TYPES = {
  normal: { name:'通常問題部屋', icon:'⚔️', desc:'標準問題を1問。安定ルート。' },
  elite: { name:'強敵問題部屋', icon:'💀', desc:'少し難しい問題。正解時EXP多め。' },
  treasure: { name:'宝箱部屋', icon:'🎁', desc:'知識カードを獲得。' },
  rest: { name:'休憩部屋', icon:'☕', desc:'HPを回復。' },
  lecture: { name:'解説部屋', icon:'📘', desc:'苦手分野のミニ講義。' },
  boss: { name:'ボス部屋', icon:'👑', desc:'この階層の総仕上げ。' }
};

const CARDS = [
  { id:'mfa', name:'多要素認証', desc:'1回だけ誤選択肢を1つ非表示', kind:'assist' },
  { id:'log', name:'ログ監視', desc:'不正解ダメージを5軽減', kind:'def' },
  { id:'normalization', name:'正規化', desc:'DB問題の攻撃力+15', kind:'atk' },
  { id:'cache', name:'キャッシュ', desc:'ネットワーク問題の攻撃力+15', kind:'atk' },
  { id:'failover', name:'フェールオーバ', desc:'HP0時に一度だけ30で復活', kind:'life' },
  { id:'criticalpath', name:'クリティカルパス', desc:'プロジェクト管理問題の攻撃力+20', kind:'atk' }
];

const QUESTIONS = [
  { id:'sec_001', category:'セキュリティ', monster:'sql', difficulty:'基本', question:'SQLインジェクション対策として最も適切なものはどれか。', choices:['SQL文を文字列連結で組み立てる','プレースホルダを使ってSQLを実行する','DB接続を常に管理者権限にする','エラー内容を詳細に画面表示する'], answer:1, explanation:'外部入力をSQL文へ直接連結しないことが重要です。プレースホルダを使うと、入力値をSQL構文ではなくデータとして扱えます。', source:SOURCE_NOTE },
  { id:'sec_002', category:'セキュリティ', monster:'sql', difficulty:'基本', question:'パスワードリスト攻撃への対策として有効なものはどれか。', choices:['多要素認証を導入する','利用者IDを短くする','ログイン失敗ログを残さない','全利用者に同じ初期パスワードを配布する'], answer:0, explanation:'漏えい済みID/パスワードの使い回しを悪用する攻撃には、多要素認証や試行制限、異常検知が有効です。', source:SOURCE_NOTE },
  { id:'sec_003', category:'セキュリティ', monster:'audit', difficulty:'標準', question:'公開鍵暗号方式の説明として適切なものはどれか。', choices:['暗号化と復号に同じ秘密鍵だけを使う','公開鍵と秘密鍵の組を使う','鍵を一切使わない','ハッシュ値から必ず元データを復元する'], answer:1, explanation:'公開鍵暗号方式では公開鍵と秘密鍵のペアを使います。暗号化、電子署名、鍵交換などで利用されます。', source:SOURCE_NOTE },
  { id:'sec_004', category:'セキュリティ', monster:'sql', difficulty:'標準', question:'CSRF対策として適切なものはどれか。', choices:['重要なリクエストに推測困難なトークンを付与して検証する','Cookieを常に平文で送る','POSTをGETへ変更する','パスワードを画面に表示する'], answer:0, explanation:'CSRFでは利用者の認証状態を悪用されます。推測困難なトークンやSameSite属性などで意図しないリクエストを防ぎます。', source:SOURCE_NOTE },
  { id:'net_001', category:'ネットワーク', monster:'dns', difficulty:'基本', question:'DNSでドメイン名に対応するIPv4アドレスを表すレコードはどれか。', choices:['MXレコード','Aレコード','TXTレコード','NSレコード'], answer:1, explanation:'Aレコードはドメイン名に対応するIPv4アドレスを表します。MXはメール配送先、TXTは任意文字列、NSは権威DNSサーバです。', source:SOURCE_NOTE },
  { id:'net_002', category:'ネットワーク', monster:'dns', difficulty:'基本', question:'TCPの特徴として適切なものはどれか。', choices:['コネクションレスで到達確認をしない','信頼性のある通信を提供する','IPアドレスを名前に変換する','Webページの見た目を定義する'], answer:1, explanation:'TCPはコネクション型で、順序制御や再送制御などにより信頼性のある通信を提供します。', source:SOURCE_NOTE },
  { id:'net_003', category:'ネットワーク', monster:'dns', difficulty:'標準', question:'HTTPSで主に使われるTLSの目的として適切なものはどれか。', choices:['通信の暗号化やサーバ認証を行う','DBの正規化を行う','CPUのクロックを上げる','画面の配色を決める'], answer:0, explanation:'TLSは通信の暗号化、改ざん検知、サーバ認証などを提供し、HTTPと組み合わせてHTTPSとして使われます。', source:SOURCE_NOTE },
  { id:'net_004', category:'ネットワーク', monster:'dns', difficulty:'標準', question:'負荷分散装置の役割として適切なものはどれか。', choices:['複数サーバへリクエストを振り分ける','全ログを削除する','暗号鍵を紙に印刷する','SQL文の構文解析だけを行う'], answer:0, explanation:'ロードバランサは複数のサーバにリクエストを振り分け、性能や可用性を高めます。', source:SOURCE_NOTE },
  { id:'db_001', category:'データベース', monster:'deadlock', difficulty:'基本', question:'第3正規形の目的に最も近いものはどれか。', choices:['データの重複や更新時の不整合を減らす','表を必ず1つにまとめる','主キーを禁止する','SQLを使えなくする'], answer:0, explanation:'正規化はデータの重複や更新時の不整合を減らし、保守しやすいデータ構造にするための考え方です。', source:SOURCE_NOTE },
  { id:'db_002', category:'データベース', monster:'deadlock', difficulty:'標準', question:'トランザクションのACID特性のうち、一連の処理が全て成功するか全て取り消される性質はどれか。', choices:['原子性','一貫性','独立性','永続性'], answer:0, explanation:'原子性はトランザクションが全て実行されるか、全て実行されない状態に戻る性質です。', source:SOURCE_NOTE },
  { id:'db_003', category:'データベース', monster:'deadlock', difficulty:'標準', question:'検索条件に頻繁に使う列へインデックスを作成する際の注意として適切なものはどれか。', choices:['検索性能だけでなく更新性能や容量への影響も確認する','全ての列に必ず作成する','バックアップが不要になる','SQLインジェクション対策になる'], answer:0, explanation:'インデックスは検索を高速化できる一方、更新時の負荷や容量増加の影響があります。利用状況を見て設計します。', source:SOURCE_NOTE },
  { id:'db_004', category:'データベース', monster:'deadlock', difficulty:'標準', question:'デッドロックが発生した状態として適切なものはどれか。', choices:['複数の処理が互いの資源解放を待ち続ける','CPU使用率が常に0%になる','全ユーザーが同時にログアウトする','DNSのAレコードが消える'], answer:0, explanation:'デッドロックは複数のトランザクションなどが互いに相手の保持する資源を待ち、処理が進まなくなる状態です。', source:SOURCE_NOTE },
  { id:'alg_001', category:'アルゴリズム', monster:'buffer', difficulty:'基本', question:'二分探索の前提として適切なものはどれか。', choices:['探索対象が整列済みである','データが必ず画像である','要素数が1つだけである','ハッシュ値を復号できる'], answer:0, explanation:'二分探索は整列済みデータを対象に、探索範囲を半分ずつ絞る探索方法です。', source:SOURCE_NOTE },
  { id:'alg_002', category:'アルゴリズム', monster:'buffer', difficulty:'標準', question:'要素数nの単純な線形探索の平均的な時間計算量として最も近いものはどれか。', choices:['O(1)','O(log n)','O(n)','O(n^2)'], answer:2, explanation:'線形探索は先頭から順に調べるため、平均的にも要素数に比例してO(n)です。', source:SOURCE_NOTE },
  { id:'alg_003', category:'アルゴリズム', monster:'buffer', difficulty:'標準', question:'スタックのデータ取り出し方式として適切なものはどれか。', choices:['LIFO','FIFO','DNS','EVM'], answer:0, explanation:'スタックは後から入れたデータを先に取り出すLIFO（Last In, First Out）です。', source:SOURCE_NOTE },
  { id:'pm_001', category:'プロジェクト管理', monster:'path', difficulty:'基本', question:'WBSの説明として適切なものはどれか。', choices:['作業を階層的に分解して管理する','通信を暗号化する方式','DBの排他制御方式','IPアドレスの表記方法'], answer:0, explanation:'WBSはプロジェクトの成果物や作業を階層的に分解し、範囲や担当、進捗を管理しやすくする手法です。', source:SOURCE_NOTE },
  { id:'pm_002', category:'プロジェクト管理', monster:'path', difficulty:'標準', question:'EVMでEVがPVより小さい場合の解釈として適切なものはどれか。', choices:['計画より進捗が遅れている','計画より必ずコストが安い','品質が必ず高い','セキュリティ事故が発生した'], answer:0, explanation:'EV（出来高）がPV（計画価値）より小さい場合、計画より進捗が遅れていると読み取れます。', source:SOURCE_NOTE },
  { id:'pm_003', category:'プロジェクト管理', monster:'path', difficulty:'標準', question:'クリティカルパス上の作業が遅れると何が起きやすいか。', choices:['プロジェクト全体の完了が遅れる','必ずコストが0になる','全作業が自動化される','DNS障害が起きる'], answer:0, explanation:'クリティカルパスは全体期間を決める作業列です。その作業が遅れるとプロジェクト全体の完了が遅れる可能性が高いです。', source:SOURCE_NOTE },
  { id:'audit_001', category:'システム監査', monster:'audit', difficulty:'基本', question:'監査証跡として重要なものはどれか。', choices:['誰が、いつ、何を行ったかを確認できるログ','画面の背景色','利用者の好きな食べ物','全ての権限を管理者にする設定'], answer:0, explanation:'監査では、処理の実施者、日時、内容、結果などを追跡できるログが重要です。', source:SOURCE_NOTE },
  { id:'audit_002', category:'システム監査', monster:'audit', difficulty:'標準', question:'職務分掌の目的として適切なものはどれか。', choices:['権限を分け、不正や誤りを起こしにくくする','全員に全権限を与える','ログを取らない','バックアップを削除する'], answer:0, explanation:'職務分掌は作業や承認権限を分け、単独で不正や重大な誤りが起きにくい統制を作ります。', source:SOURCE_NOTE },
  { id:'audit_003', category:'システム監査', monster:'audit', difficulty:'標準', question:'アクセス権の定期棚卸しで確認すべきことはどれか。', choices:['業務上不要になった権限が残っていないか','利用者の血液型','画面のフォントサイズ','DNSのMXレコードだけ'], answer:0, explanation:'異動・退職・役割変更後に不要な権限が残るとリスクになります。定期的に権限を見直します。', source:SOURCE_NOTE },
  { id:'str_001', category:'経営戦略', monster:'audit', difficulty:'基本', question:'SWOT分析のSが表すものはどれか。', choices:['Strengths（強み）','Speed（速度）','Storage（記憶装置）','Session（通信単位）'], answer:0, explanation:'SWOTは強み、弱み、機会、脅威を整理する分析です。SはStrengthsです。', source:SOURCE_NOTE },
  { id:'str_002', category:'経営戦略', monster:'audit', difficulty:'標準', question:'PPMにおける「花形」に最も近い説明はどれか。', choices:['市場成長率も市場占有率も高い事業','成長率も占有率も低い事業','占有率は高いが成長率は低い事業','市場調査を行わない事業'], answer:0, explanation:'PPMの花形は市場成長率も相対的市場占有率も高い事業です。資金投入が必要ですが将来の稼ぎ頭候補です。', source:SOURCE_NOTE },
  { id:'str_003', category:'経営戦略', monster:'audit', difficulty:'標準', question:'損益分岐点売上高を下げる施策として適切なものはどれか。', choices:['固定費を削減する','固定費を増やす','変動費率を上げる','販売単価を必ず下げる'], answer:0, explanation:'固定費削減や限界利益率の改善は、損益分岐点売上高を下げる方向に働きます。', source:SOURCE_NOTE }
];

const CASE_QUESTS = [
  { id:'login_incident', title:'止まらない不正ログイン', category:'セキュリティ', boss:'監査ログスペクター', monster:'audit', difficulty:'午後・標準',
    brief:'ECサイトで不正ログインが急増。短時間に大量のログイン失敗が発生し、一部アカウントではログイン成功後に配送先が変更されていた。',
    evidence:[
      { title:'アクセスログ', text:'同一IP帯から短時間に大量のログイン試行。成功後すぐ配送先変更APIが呼ばれている。' },
      { title:'利用者状況', text:'被害利用者の多くは他サービスと同じパスワードを使っていた可能性がある。' },
      { title:'現行対策', text:'IDとパスワードのみでログイン。多要素認証と試行制限は未導入。' },
      { title:'監視体制', text:'ログは取得しているが、異常な失敗回数を検知して通知する仕組みはない。' }
    ],
    questions:[
      { category:'セキュリティ', type:'原因推理', question:'今回の攻撃として最も疑わしいものはどれか。', context:'他サービスと同じパスワード、短時間の大量試行に注目。', choices:['パスワードリスト攻撃','DNSキャッシュポイズニング','クリティカルパス遅延','正規化違反'], answer:0, explanation:'漏えい済みID/パスワードの組合せを使う攻撃なので、パスワードリスト攻撃が疑われます。', source:SOURCE_NOTE },
      { category:'セキュリティ', type:'対策選択', question:'被害拡大を抑える対策として適切なものはどれか。', context:'ID/パスワードだけでは突破される可能性がある。', choices:['多要素認証を導入する','全利用者に同じパスワードを配る','ログを削除する','配送先変更を誰でも可能にする'], answer:0, explanation:'多要素認証により、パスワードが知られても不正ログインを防ぎやすくなります。', source:SOURCE_NOTE },
      { category:'システム監査', type:'運用判断', question:'監視強化として適切なものはどれか。', context:'ログはあるが検知に使えていない。', choices:['ログイン失敗回数や異常操作を検知して通知する','ログを取得しない','成功ログだけ削除する','IPアドレスを保存しない'], answer:0, explanation:'ログを取得するだけでなく、異常な失敗回数や成功後の不審操作を検知・通知できる運用が重要です。', source:SOURCE_NOTE },
      { category:'セキュリティ', type:'ボス設問', boss:true, question:'再発防止策の組合せとして最も妥当なものはどれか。', context:'認証、試行制限、監視、利用者通知を組み合わせる。', choices:['多要素認証、試行制限、異常検知、パスワード変更通知','エラーメッセージを詳細化するだけ','全権限を一般利用者へ与える','バックアップを削除する'], answer:0, explanation:'単一対策ではなく、認証強化、試行制限、監視、通知を組み合わせるのが現実的です。', source:SOURCE_NOTE }
    ]
  },
  { id:'slow_ec', title:'遅すぎるECサイト', category:'ネットワーク / DB', boss:'デッドロックゴーレム', monster:'deadlock', difficulty:'午後・標準',
    brief:'セール開始後、ECサイトの商品検索と画像表示が遅くなった。Webサーバは1台構成で、DB検索にも時間がかかっている。',
    evidence:[
      { title:'アクセス傾向', text:'トップページより商品検索結果と画像配信へのアクセスが集中している。' },
      { title:'DBログ', text:'商品検索に使う列へインデックスがなく、同じ条件のSELECTが大量に実行されている。' },
      { title:'構成図', text:'Webサーバは1台。静的コンテンツ配信にCDNやキャッシュは使っていない。' },
      { title:'障害影響', text:'時間帯によっては検索結果ページがタイムアウトし、機会損失が発生している。' }
    ],
    questions:[
      { category:'ネットワーク', type:'切り分け', question:'静的コンテンツ配信の負荷を下げる対策はどれか。', context:'画像など同じデータへのアクセスが集中。', choices:['CDNやキャッシュを活用する','DBの主キーを削除する','全通信を平文にする','ログを残さない'], answer:0, explanation:'CDNやキャッシュは静的コンテンツ配信負荷を下げ、レスポンス改善に役立ちます。', source:SOURCE_NOTE },
      { category:'データベース', type:'対策選択', question:'商品検索が遅い場合、DB側の改善として適切なものはどれか。', context:'検索対象列にインデックスがない。', choices:['検索条件に使う列へ適切なインデックスを検討する','SELECT文を全てDELETE文に変える','DBのバックアップを削除する','HTTPをSMTPに変更する'], answer:0, explanation:'検索条件に使う列へインデックスを設定すると検索処理を高速化できる場合があります。', source:SOURCE_NOTE },
      { category:'ネットワーク', type:'可用性', question:'Webサーバ1台構成の単一障害点を緩和する方法はどれか。', context:'負荷集中と障害時停止が課題。', choices:['複数台構成にしロードバランサで分散する','画面の文字色を変える','表名を短くする','ログイン画面だけ残す'], answer:0, explanation:'複数台構成とロードバランサにより、負荷分散と可用性向上が期待できます。', source:SOURCE_NOTE },
      { category:'データベース', type:'ボス設問', boss:true, question:'今回の対策方針として最も妥当な組合せはどれか。', context:'Web配信、DB検索、構成の3点をまとめて考える。', choices:['CDN/キャッシュ、DBインデックス、ロードバランサを検討する','DBを削除しWebだけで運用する','ログを消して負荷を下げる','DNSを使わずIPを手入力させる'], answer:0, explanation:'アクセス集中時は静的配信、DB検索、サーバ構成の複数面からボトルネックを改善します。', source:SOURCE_NOTE }
    ]
  },
  { id:'burning_project', title:'炎上する開発プロジェクト', category:'プロジェクト管理', boss:'クリティカルパスワーム', monster:'path', difficulty:'午後・やや難',
    brief:'新システム開発で要件変更が続き、テスト工程に遅れが出始めた。PMはWBS、EVM、リスク対応を見直す必要がある。',
    evidence:[
      { title:'WBS状況', text:'一部作業が大きすぎ、担当や完了条件が曖昧なまま進んでいる。' },
      { title:'工程依存', text:'結合テスト開始にはAPI実装とDB移行リハーサルの完了が必要。API実装が2日遅れ。' },
      { title:'EVMメモ', text:'PV=100、EV=80、AC=110。計画より出来高が少なく、実コストは大きい。' },
      { title:'リスク一覧', text:'要件変更、主要メンバー兼任、外部API仕様変更が未対応リスクとして残っている。' }
    ],
    questions:[
      { category:'プロジェクト管理', type:'用語理解', question:'WBSの改善として最も適切なものはどれか。', context:'作業が大きすぎて管理できていない。', choices:['作業を階層的に分解し成果物や担当を明確にする','作業名を全て同じにする','担当者を非公開にする','完了条件をなくす'], answer:0, explanation:'WBSは作業を分解して管理しやすくし、担当や完了条件を明確にします。', source:SOURCE_NOTE },
      { category:'プロジェクト管理', type:'進捗判断', question:'PV=100、EV=80、AC=110の状態として最も近いものはどれか。', context:'EVMの基本指標を読む。', choices:['計画より遅れ、コストも超過している','計画より進み、コストも節約できている','進捗は計画通り','コスト情報だけでは判断できない'], answer:0, explanation:'EV<PVなので進捗遅れ、AC>EVなのでコスト効率も悪い状態です。', source:SOURCE_NOTE },
      { category:'プロジェクト管理', type:'原因推理', question:'API実装の遅れが全体納期に影響しやすい理由はどれか。', context:'結合テスト開始条件に注目。', choices:['後続作業である結合テスト開始の前提になっているため','API実装は必ず最も安い作業だから','DB移行と無関係だから','進捗管理の対象外だから'], answer:0, explanation:'後続作業の開始条件になる作業が遅れると、クリティカルパス上なら全体納期に影響します。', source:SOURCE_NOTE },
      { category:'プロジェクト管理', type:'ボス設問', boss:true, question:'リスク対応として最も適切な進め方はどれか。', context:'要件変更や外部API仕様変更が残っている。', choices:['影響度と発生確率を評価し対応策と担当を決める','全リスクを無視する','リスク一覧を削除する','問題後だけ口頭相談する'], answer:0, explanation:'リスクは発生確率と影響度を評価し、回避・軽減・転嫁・受容などの対応方針を決めます。', source:SOURCE_NOTE }
    ]
  }
];

const ACHIEVEMENTS = [
  { id:'first_step', icon:'🐣', name:'見習い情報処理士', desc:'1問以上解く', check:s => s.total >= 1 },
  { id:'ten_questions', icon:'⚔️', name:'10問突破者', desc:'累計10問解く', check:s => s.total >= 10 },
  { id:'hundred_questions', icon:'🏰', name:'百問の冒険者', desc:'累計100問解く', check:s => s.total >= 100 },
  { id:'security', icon:'🛡️', name:'セキュリティナイト', desc:'セキュリティを10問正解', check:s => (s.byCategory['セキュリティ']?.correct || 0) >= 10 },
  { id:'network', icon:'📡', name:'DNSハンター', desc:'ネットワークを10問正解', check:s => (s.byCategory['ネットワーク']?.correct || 0) >= 10 },
  { id:'db', icon:'🧱', name:'正規化メイジ', desc:'DBを10問正解', check:s => (s.byCategory['データベース']?.correct || 0) >= 10 },
  { id:'case_clear', icon:'🕵️', name:'午後事件解決者', desc:'事件クエストを1件解決', check:s => (s.caseClears || 0) >= 1 },
  { id:'mock_70', icon:'📝', name:'模試70%突破', desc:'模試で70%以上', check:s => bestMock(s) >= 70 },
  { id:'streak3', icon:'🔥', name:'三日坊主じゃない', desc:'3日連続学習', check:s => calcStreak(s.dailyLog) >= 3 },
  { id:'pass70', icon:'🌟', name:'合格候補者', desc:'合格可能性70%以上', check:s => computePassScore(s) >= 70 }
];

let stats = loadStats();
let currentRun = null;
let currentCaseRun = null;
let currentMock = null;
let pendingNext = null;
let soundOn = true;

function $(id) { return document.getElementById(id); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function sample(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function pct(a, b) { return b ? Math.round((a / b) * 100) : 0; }
function todayKey(d=new Date()) { const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`; }
function allQuestions() { return [...QUESTIONS, ...(stats.customQuestions || [])]; }
function byId(id) { return allQuestions().find(q => q.id === id); }
function monsterFor(qOrKey) { const key = typeof qOrKey === 'string' ? qOrKey : (qOrKey.monster || CATEGORY_MONSTER[qOrKey.category] || 'sql'); return MONSTERS[key] || MONSTERS.sql; }
function bestMock(s=stats) { return Math.max(0, ...(s.mockHistory || []).map(m => m.score || 0)); }

function baseStats() {
  return { total:0, correct:0, exp:0, clears:0, caseClears:0, byCategory:{}, wrongIds:[], caseHistory:[], mockHistory:[], customQuestions:[], dailyLog:{} };
}
function loadStats() {
  try { return { ...baseStats(), ...(JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}) }; }
  catch { return baseStats(); }
}
function saveStats() { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); updateHome(); }
function ensureCategory(cat) { if (!stats.byCategory[cat]) stats.byCategory[cat] = { total:0, correct:0 }; return stats.byCategory[cat]; }
function logStudy(kind, correct=0, total=0) {
  const k = todayKey();
  const d = stats.dailyLog[k] || { questions:0, correct:0, sessions:0, dungeon:0, case:0, mock:0 };
  d.questions += total; d.correct += correct; d.sessions += 1; d[kind] = (d[kind] || 0) + 1;
  stats.dailyLog[k] = d;
}
function recordAnswer(q, ok) {
  stats.total += 1;
  if (ok) stats.correct += 1;
  const c = ensureCategory(q.category);
  c.total += 1;
  if (ok) c.correct += 1;
  if (!ok && q.id && !stats.wrongIds.includes(q.id)) stats.wrongIds.unshift(q.id);
  if (ok && q.id) stats.wrongIds = stats.wrongIds.filter(id => id !== q.id);
}
function computePassScore(s=stats) {
  const accuracy = pct(s.correct, s.total);
  const volume = Math.min(100, Math.round((s.total / 300) * 100));
  const catScores = CATEGORIES.map(c => pct(s.byCategory[c]?.correct || 0, s.byCategory[c]?.total || 0)).filter(v => v > 0);
  const balance = catScores.length ? Math.round(catScores.reduce((a,b)=>a+b,0) / CATEGORIES.length) : 0;
  const streak = Math.min(100, calcStreak(s.dailyLog) * 12);
  const mock = bestMock(s);
  return clamp(Math.round(accuracy*.35 + volume*.15 + balance*.25 + streak*.1 + mock*.15), 0, 100);
}
function calcStreak(dailyLog={}) {
  let streak = 0;
  const d = new Date();
  for (let i=0; i<365; i++) {
    const key = todayKey(d);
    if (dailyLog[key]?.questions > 0 || dailyLog[key]?.sessions > 0) streak += 1;
    else break;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}
function unlockedTitles() { return ACHIEVEMENTS.filter(a => a.check(stats)); }

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(id).classList.add('active');
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.nav === id));
  if (id === 'homeScreen') updateHome();
  if (id === 'dungeonScreen') renderDungeons();
  if (id === 'caseListScreen') renderCases();
  if (id === 'mockScreen') renderMockScreen();
  if (id === 'calendarScreen') renderCalendar();
  if (id === 'editorScreen') renderCustomQuestions();
  if (id === 'analyticsScreen') renderAnalytics();
  window.scrollTo({ top:0, behavior:'smooth' });
}
function openModal(id) { $(id).classList.add('active'); $(id).setAttribute('aria-hidden','false'); }
function closeModal(id) { $(id).classList.remove('active'); $(id).setAttribute('aria-hidden','true'); }
function flash(id, text) { const el=$(id); el.textContent=text; el.classList.remove('show'); void el.offsetWidth; el.classList.add('show'); }
function beep(type='ok') {
  if (!soundOn || !window.AudioContext) return;
  const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
  osc.type = 'triangle'; osc.frequency.value = type === 'bad' ? 140 : type === 'boss' ? 520 : 360;
  gain.gain.value = 0.035; osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .08);
}
function showExplanation(ok, q, chosen) {
  $('explainJudge').textContent = ok ? '正解！' : '不正解';
  $('explainJudge').style.color = ok ? 'var(--good)' : 'var(--danger)';
  $('explainTitle').textContent = ok ? 'よし、理解ダメージ！' : 'ここが伸びしろポイント';
  $('explainBody').innerHTML = `${q.explanation}<br><br><b>あなたの選択：</b>${chosen ?? '未選択'}`;
  $('sourceNote').textContent = q.source || SOURCE_NOTE;
  openModal('explainModal');
}
function showEvent(title, body, next, badge='イベント') {
  $('eventNextBtn').style.display = 'inline-flex';
  $('eventBadge').textContent = badge; $('eventTitle').textContent = title; $('eventBody').textContent = body; pendingNext = next; openModal('eventModal');
}

function updateHome() {
  const level = Math.max(1, Math.floor(stats.exp / 140) + 1);
  $('homeLevel').textContent = String(level);
  $('homeAccuracy').textContent = pct(stats.correct, stats.total) + '%';
  $('homePassScore').textContent = computePassScore() + '%';
  $('homeStreak').textContent = calcStreak(stats.dailyLog) + '日';
  const rec = getRecommendation();
  $('recommendTitle').textContent = rec.title;
  $('recommendBadge').textContent = rec.badge;
  $('recommendText').textContent = rec.text;
  const titles = unlockedTitles();
  $('titleCount').textContent = `${titles.length}個`;
  $('recentTitles').innerHTML = titles.length ? titles.slice(-4).reverse().map(t => `<span class="title-badge">${t.icon} ${t.name}</span>`).join('') : '<span class="muted">称号はまだありません。1問解いたら最初の称号が開きます。</span>';
}
function getRecommendation() {
  if (stats.total < 10) return { title:'まずは10問探索', badge:'START', text:'最初は「応用情報ランダム迷宮」で10問。成績データを貯めると弱点分析が動きます。' };
  if (stats.wrongIds.length >= 3) return { title:'因縁モンスターを倒そう', badge:'REVIEW', text:`未克服の間違いが${stats.wrongIds.length}問あります。復習で倒すと合格可能性が伸びやすいです。` };
  const low = CATEGORIES.map(c => ({ c, p:pct(stats.byCategory[c]?.correct || 0, stats.byCategory[c]?.total || 0), n:stats.byCategory[c]?.total || 0 })).filter(x => x.n >= 3).sort((a,b)=>a.p-b.p)[0];
  if (low && low.p < 65) return { title:`${low.c}を補強`, badge:'WEAK', text:`${low.c}の正答率が${low.p}%です。関連ダンジョンか弱点集中模試がおすすめ。` };
  if (bestMock() < 70) return { title:'ミニ模試で本番力チェック', badge:'MOCK', text:'基礎探索は回っています。次はミニ模試で分野横断の判断力を測りましょう。' };
  return { title:'午後事件クエストへ', badge:'CASE', text:'午前知識が育ってきました。午後問題風の長文判断で仕上げましょう。' };
}

function renderDungeons() {
  $('dungeonList').innerHTML = DUNGEONS.map(d => `<article class="dungeon-card"><div><p class="badge">${d.label}</p><h3>${d.name}</h3><p>${d.description}</p><div class="dungeon-tags">${d.categories.map(c=>`<span class="tag">${c}</span>`).join('')}</div></div><button class="primary-btn" data-dungeon="${d.id}" type="button">挑戦</button></article>`).join('');
}
function startRun(dungeonId, review=false) {
  const dungeon = DUNGEONS.find(d => d.id === dungeonId) || DUNGEONS[3];
  let pool = allQuestions().filter(q => dungeon.categories.includes(q.category));
  if (review) {
    pool = stats.wrongIds.map(byId).filter(Boolean);
    if (!pool.length) return showEvent('復習リストなし', 'まだ因縁モンスターはいません。探索や模試で問題を解いてみよう。', () => { closeModal('eventModal'); showScreen('homeScreen'); }, '因縁');
  }
  currentRun = { mode:review ? 'review' : 'rogue', dungeon, pool, hp:100, maxHp:100, floor:1, maxFloor:review ? Math.min(5, Math.max(3, pool.length)) : 7, correct:0, answered:0, cards:[], usedMfa:false, usedFailover:false, currentRoom:null, currentQuestion:null, currentEnemyHp:0, enemyMaxHp:0 };
  showMap();
}
function showMap() {
  if (!currentRun) return;
  if (currentRun.floor > currentRun.maxFloor) return finishRun(true);
  showScreen('mapScreen');
  $('mapDungeonName').textContent = currentRun.mode === 'review' ? '因縁モンスター再戦' : currentRun.dungeon.name;
  $('mapFloor').textContent = `${currentRun.floor}/${currentRun.maxFloor}`; $('mapHp').textContent = `${currentRun.hp}/${currentRun.maxHp}`; $('mapCorrect').textContent = `${currentRun.correct}問`;
  $('cardCountText').textContent = `${currentRun.cards.length}枚`;
  $('activeCards').innerHTML = currentRun.cards.length ? currentRun.cards.map(c => `<span class="active-card">${c.name}</span>`).join('') : '<span class="muted">まだカードはありません。</span>';
  const rooms = generateRooms();
  $('roomOptions').innerHTML = rooms.map(r => `<button class="room-card" type="button" data-room="${r}"><div class="room-icon">${ROOM_TYPES[r].icon}</div><strong>${ROOM_TYPES[r].name}</strong><span>${ROOM_TYPES[r].desc}</span></button>`).join('');
}
function generateRooms() {
  if (currentRun.floor === currentRun.maxFloor) return ['boss'];
  if (currentRun.mode === 'review') return ['normal','elite'];
  return shuffle(['normal','elite','treasure','rest','lecture']).slice(0, currentRun.floor <= 2 ? 2 : 3);
}
function enterRoom(type) {
  currentRun.currentRoom = type;
  if (type === 'treasure') return showCardPick();
  if (type === 'rest') { const before=currentRun.hp; currentRun.hp=clamp(currentRun.hp+25,0,currentRun.maxHp); return showEvent('休憩部屋', `HPが${currentRun.hp-before}回復した。深呼吸。コーヒー。人類の勝利。`, () => { closeModal('eventModal'); currentRun.floor++; showMap(); }, '休憩'); }
  if (type === 'lecture') return showLecture();
  startBattle(type);
}
function showCardPick() {
  const choices = shuffle(CARDS).slice(0,3);
  $('eventNextBtn').style.display = 'none';
  $('eventBadge').textContent = '宝箱'; $('eventTitle').textContent = '知識カードを1枚選ぼう';
  $('eventBody').innerHTML = choices.map(c => `<button class="choice-btn" data-card="${c.id}" type="button"><b>${c.name}</b><br>${c.desc}</button>`).join('');
  pendingNext = () => {};
  openModal('eventModal');
  $('eventBody').querySelectorAll('[data-card]').forEach(btn => btn.addEventListener('click', () => {
    const card = CARDS.find(c=>c.id===btn.dataset.card); currentRun.cards.push(card); closeModal('eventModal'); currentRun.floor++; showMap();
  }));
}
function showLecture() {
  const low = CATEGORIES.map(c => ({ c, p:pct(stats.byCategory[c]?.correct || 0, stats.byCategory[c]?.total || 0), n:stats.byCategory[c]?.total || 0 })).filter(x=>x.n>0).sort((a,b)=>a.p-b.p)[0];
  const topic = low?.c || sample(currentRun.dungeon.categories);
  const tips = {
    'セキュリティ':'攻撃名だけでなく「原因・影響・対策」をセットにすると午後問題で効きます。',
    'ネットワーク':'DNS、HTTP、TLS、ロードバランサは構成図とセットで押さえると強いです。',
    'データベース':'正規化、インデックス、トランザクションは「何を防ぐか」まで言えると勝ち。',
    'アルゴリズム':'計算量はざっくり増え方の感覚が大事。O(n)とO(log n)の違いから。',
    'プロジェクト管理':'WBS、EVM、クリティカルパスは数値より状況判断が出やすいです。',
    'システム監査':'職務分掌、権限、ログ、証跡。誰が何をしたか追える状態が肝です。',
    '経営戦略':'SWOT、PPM、損益分岐点は用語暗記より分類問題に慣れるのが近道。'
  };
  showEvent(`${topic}のミニ講義`, tips[topic], () => { closeModal('eventModal'); currentRun.floor++; showMap(); }, '解説');
}
function startBattle(type) {
  let pool = currentRun.pool.length ? currentRun.pool : allQuestions();
  if (type === 'boss' || type === 'elite') pool = pool.filter(q => q.difficulty !== '基本').length ? pool.filter(q => q.difficulty !== '基本') : pool;
  const q = sample(pool);
  currentRun.currentQuestion = q;
  currentRun.enemyMaxHp = type === 'boss' ? 140 : type === 'elite' ? 105 : 75;
  currentRun.currentEnemyHp = currentRun.enemyMaxHp;
  renderBattle();
}
function renderBattle() {
  const q = currentRun.currentQuestion; const monster = monsterFor(q);
  showScreen('battleScreen');
  $('dungeonName').textContent = currentRun.mode === 'review' ? '因縁モンスター再戦' : currentRun.dungeon.name;
  $('battleTitle').textContent = monster.name;
  $('battleProgress').textContent = `${currentRun.floor}/${currentRun.maxFloor}`;
  $('roomBanner').textContent = ROOM_TYPES[currentRun.currentRoom].name;
  $('roomBanner').classList.toggle('boss', currentRun.currentRoom === 'boss');
  $('playerHpText').textContent = `${currentRun.hp}/${currentRun.maxHp}`; $('playerHpBar').style.width = pct(currentRun.hp,currentRun.maxHp)+'%';
  $('enemyNameHp').textContent = monster.name; $('enemyHpText').textContent = `${currentRun.currentEnemyHp}/${currentRun.enemyMaxHp}`; $('enemyHpBar').style.width = pct(currentRun.currentEnemyHp,currentRun.enemyMaxHp)+'%';
  $('enemyImage').src = monster.image;
  $('battleLog').textContent = currentRun.currentRoom === 'boss' ? 'ボス問題！ここを抜ければ探索クリア。' : '問題に答えて攻撃しよう。';
  $('battleCards').innerHTML = currentRun.cards.length ? currentRun.cards.map(c=>`<span class="active-card">${c.name}</span>`).join('') : '<span class="muted">カードなし</span>';
  $('questionCategory').textContent = q.category; $('questionDifficulty').textContent = q.difficulty || '標準'; $('rivalBadge').classList.toggle('hidden', !stats.wrongIds.includes(q.id));
  $('questionText').textContent = q.question; $('hintText').textContent = q.context || '';
  renderChoices(q, 'choices', handleAnswer, currentRun.cards.some(c=>c.id==='mfa') && !currentRun.usedMfa);
}
function renderChoices(q, containerId, handler, canHide=false) {
  let hidden = -1;
  if (canHide) {
    const wrongs = q.choices.map((_,i)=>i).filter(i=>i!==q.answer); hidden = sample(wrongs);
    currentRun.usedMfa = true;
  }
  $(containerId).innerHTML = q.choices.map((choice,i) => i===hidden ? `<button class="choice-btn" disabled type="button">${String.fromCharCode(65+i)}. 多要素認証カードで除外</button>` : `<button class="choice-btn" type="button" data-choice="${i}">${String.fromCharCode(65+i)}. ${choice}</button>`).join('');
  $(containerId).querySelectorAll('[data-choice]').forEach(btn => btn.addEventListener('click', () => handler(Number(btn.dataset.choice))));
}
function calcAttack(q) {
  let atk = currentRun.currentRoom === 'boss' ? 85 : currentRun.currentRoom === 'elite' ? 65 : 50;
  if (q.category === 'データベース' && currentRun.cards.some(c=>c.id==='normalization')) atk += 15;
  if (q.category === 'ネットワーク' && currentRun.cards.some(c=>c.id==='cache')) atk += 15;
  if (q.category === 'プロジェクト管理' && currentRun.cards.some(c=>c.id==='criticalpath')) atk += 20;
  return atk;
}
function handleAnswer(choiceIndex) {
  const q = currentRun.currentQuestion; const ok = choiceIndex === q.answer;
  document.querySelectorAll('#choices .choice-btn').forEach((b,i) => { b.disabled=true; if (i===q.answer) b.classList.add('correct'); if (i===choiceIndex && !ok) b.classList.add('wrong'); });
  currentRun.answered++;
  recordAnswer(q, ok);
  if (ok) { currentRun.correct++; const dmg=calcAttack(q); currentRun.currentEnemyHp=clamp(currentRun.currentEnemyHp-dmg,0,currentRun.enemyMaxHp); flash('damagePop', `-${dmg}`); $('battleLog').textContent='正解！モンスターに理解ダメージ。'; beep(currentRun.currentRoom==='boss'?'boss':'ok'); }
  else { let dmg = currentRun.currentRoom === 'boss' ? 26 : currentRun.currentRoom === 'elite' ? 20 : 15; if (currentRun.cards.some(c=>c.id==='log')) dmg=Math.max(5,dmg-5); currentRun.hp=clamp(currentRun.hp-dmg,0,currentRun.maxHp); $('battleLog').textContent=`不正解。HPに${dmg}ダメージ。`; beep('bad'); if (currentRun.hp<=0 && currentRun.cards.some(c=>c.id==='failover') && !currentRun.usedFailover) { currentRun.usedFailover=true; currentRun.hp=30; $('battleLog').textContent+=' フェールオーバで復活！'; } }
  $('playerHpText').textContent = `${currentRun.hp}/${currentRun.maxHp}`; $('playerHpBar').style.width = pct(currentRun.hp,currentRun.maxHp)+'%';
  $('enemyHpText').textContent = `${currentRun.currentEnemyHp}/${currentRun.enemyMaxHp}`; $('enemyHpBar').style.width = pct(currentRun.currentEnemyHp,currentRun.enemyMaxHp)+'%';
  pendingNext = () => { closeModal('explainModal'); if (currentRun.hp<=0) return finishRun(false); if (currentRun.currentRoom === 'boss') return finishRun(ok); currentRun.floor++; showMap(); };
  showExplanation(ok, q, q.choices[choiceIndex]);
}
function finishRun(clear) {
  const exp = currentRun.correct * 22 + (clear ? 90 : 10) + currentRun.cards.length * 4;
  stats.exp += exp; if (clear) stats.clears += 1;
  logStudy('dungeon', currentRun.correct, currentRun.answered);
  saveStats();
  $('resultBadge').textContent = currentRun.mode === 'review' ? '復習結果' : '探索結果';
  $('resultTitle').textContent = clear ? '踏破成功！' : '撤退…';
  $('resultMessage').textContent = clear ? '知識の刃、かなり研がれてます。次は模試で測ってみよう。' : 'HPが尽きました。でも解説を読んだ分だけ、次は刺さります。';
  $('resultCorrect').textContent = `${currentRun.correct}/${currentRun.answered}`; $('resultMiddleLabel').textContent='到達'; $('resultFloor').textContent=`${Math.min(currentRun.floor,currentRun.maxFloor)}F`; $('resultExp').textContent=String(exp);
  $('resultExtra').innerHTML = `獲得カード：${currentRun.cards.map(c=>c.name).join('、') || 'なし'}`;
  $('retryBtn').onclick = () => startRun(currentRun.dungeon.id, currentRun.mode === 'review');
  showScreen('resultScreen');
}

function renderCases() {
  $('caseList').innerHTML = CASE_QUESTS.map(c => { const best=(stats.caseHistory||[]).filter(h=>h.id===c.id).sort((a,b)=>b.score-a.score)[0]; return `<article class="dungeon-card"><div><p class="badge">${c.difficulty}</p><h3>${c.title}</h3><p>${c.brief}</p><div class="dungeon-tags"><span class="tag">${c.category}</span><span class="tag">ボス：${c.boss}</span>${best?`<span class="tag">最高 ${best.score}%</span>`:''}</div></div><button class="primary-btn purple" data-case="${c.id}" type="button">調査開始</button></article>`; }).join('');
}
function startCase(id) { const quest=CASE_QUESTS.find(c=>c.id===id)||CASE_QUESTS[0]; currentCaseRun={quest,hp:100,maxHp:100,opened:[],index:0,correct:0,answered:0}; renderCaseScreen(); }
function renderCaseScreen() {
  const { quest } = currentCaseRun; showScreen('caseScreen');
  $('caseCategory').textContent=quest.category; $('caseTitle').textContent=quest.title; $('caseBrief').textContent=quest.brief; $('caseMonster').src=monsterFor(quest.monster).image;
  $('caseHpText').textContent=`${currentCaseRun.hp}/${currentCaseRun.maxHp}`; $('caseHpBar').style.width=pct(currentCaseRun.hp,currentCaseRun.maxHp)+'%'; $('evidenceCounter').textContent=`${currentCaseRun.opened.length}/${quest.evidence.length}`;
  $('evidenceGrid').innerHTML=quest.evidence.map((e,i)=>`<button class="evidence-card ${currentCaseRun.opened.includes(i)?'opened':''}" type="button" data-evidence="${i}"><strong>${currentCaseRun.opened.includes(i)?'✅':'🔎'} ${e.title}</strong><p>${currentCaseRun.opened.includes(i)?e.text:'タップして内容を確認'}</p></button>`).join('');
  $('evidenceGrid').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>{ if(!currentCaseRun.opened.includes(Number(btn.dataset.evidence))) currentCaseRun.opened.push(Number(btn.dataset.evidence)); renderCaseScreen(); }));
  $('startJudgementBtn').disabled = currentCaseRun.opened.length < Math.min(2, quest.evidence.length);
}
function startCaseJudgement() { currentCaseRun.index=0; currentCaseRun.correct=0; currentCaseRun.answered=0; showCaseQuestion(); }
function showCaseQuestion() {
  const { quest, index }=currentCaseRun; if (index>=quest.questions.length) return finishCase(true);
  const q=quest.questions[index]; showScreen('caseBattleScreen');
  $('caseBattleMode').textContent=q.boss?'ボス戦':'判断パート'; $('caseBattleTitle').textContent=q.boss?quest.boss:quest.title; $('caseProgress').textContent=`${index+1}/${quest.questions.length}`; $('caseRoomBanner').textContent=q.boss?`ボス：${quest.boss}`:'事件解決'; $('caseBossBadge').classList.toggle('hidden',!q.boss);
  $('caseBattleImage').src=monsterFor(quest.monster).image; $('caseBattleHpText').textContent=`${currentCaseRun.hp}/${currentCaseRun.maxHp}`; $('caseBattleHpBar').style.width=pct(currentCaseRun.hp,currentCaseRun.maxHp)+'%';
  $('caseQuestionCategory').textContent=q.category; $('caseQuestionType').textContent=q.type; $('caseQuestionText').textContent=q.question; $('caseQuestionContext').textContent=q.context; $('caseLog').textContent=q.boss?'ボス設問！証拠と設問条件をセットで読む。':'証拠を根拠に、最も妥当な判断を選ぼう。';
  $('caseEvidenceMini').innerHTML=quest.evidence.map((e,i)=>`<details ${currentCaseRun.opened.includes(i)?'open':''}><summary>${e.title}</summary><p>${e.text}</p></details>`).join('');
  $('caseChoices').innerHTML=q.choices.map((choice,i)=>`<button class="choice-btn" type="button" data-choice="${i}">${String.fromCharCode(65+i)}. ${choice}</button>`).join('');
  $('caseChoices').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>handleCaseAnswer(Number(btn.dataset.choice))));
}
function handleCaseAnswer(choiceIndex) {
  const q=currentCaseRun.quest.questions[currentCaseRun.index]; const ok=choiceIndex===q.answer;
  document.querySelectorAll('#caseChoices .choice-btn').forEach((b,i)=>{ b.disabled=true; if(i===q.answer)b.classList.add('correct'); if(i===choiceIndex&&!ok)b.classList.add('wrong'); });
  currentCaseRun.answered++; if(ok){ currentCaseRun.correct++; flash('caseDamagePop', q.boss?'-80':'-40'); $('caseLog').textContent=q.boss?'ボスに大ダメージ！':'正解！調査が前進。'; beep(q.boss?'boss':'ok'); } else { const dmg=q.boss?24:16; currentCaseRun.hp=clamp(currentCaseRun.hp-dmg,0,currentCaseRun.maxHp); $('caseLog').textContent=`不正解。調査HPに${dmg}ダメージ。`; beep('bad'); }
  recordAnswer({ category:q.category }, ok);
  $('caseBattleHpText').textContent=`${currentCaseRun.hp}/${currentCaseRun.maxHp}`; $('caseBattleHpBar').style.width=pct(currentCaseRun.hp,currentCaseRun.maxHp)+'%';
  pendingNext=()=>{ closeModal('explainModal'); currentCaseRun.index++; if(currentCaseRun.hp<=0) return finishCase(false); showCaseQuestion(); };
  showExplanation(ok, q, q.choices[choiceIndex]);
}
function finishCase(clear=true) {
  const q=currentCaseRun.quest; const score=pct(currentCaseRun.correct,currentCaseRun.answered); const exp=currentCaseRun.correct*30+(clear?100:20);
  stats.exp+=exp; if(clear) stats.caseClears+=1; stats.caseHistory=stats.caseHistory||[]; stats.caseHistory.unshift({ id:q.id,title:q.title,score,correct:currentCaseRun.correct,total:currentCaseRun.answered,clear,at:todayKey() }); stats.caseHistory=stats.caseHistory.slice(0,20);
  logStudy('case', currentCaseRun.correct, currentCaseRun.answered); saveStats();
  $('resultBadge').textContent='事件クエスト結果'; $('resultTitle').textContent=clear?'事件解決！':'調査失敗…'; $('resultMessage').textContent=clear?`${q.boss}を撃破。午後問題の読解力が上がっています。`:'証拠カードと解説を読めば、次はかなりいけます。'; $('resultCorrect').textContent=`${currentCaseRun.correct}/${currentCaseRun.answered}`; $('resultMiddleLabel').textContent='スコア'; $('resultFloor').textContent=`${score}%`; $('resultExp').textContent=String(exp); $('resultExtra').innerHTML=''; $('retryBtn').onclick=()=>startCase(q.id); showScreen('resultScreen');
}

function renderMockScreen() {
  $('mockBest').textContent = `BEST ${bestMock()}%`;
  const hist=stats.mockHistory||[];
  $('mockHistory').innerHTML = hist.length ? hist.slice(0,8).map(h=>`<div class="history-item">${h.at}：${h.title} / ${h.correct}/${h.total} / ${h.score}%</div>`).join('') : '<p class="muted">まだ模試履歴はありません。</p>';
}
function startMock(mode) {
  if (mode === 'case') {
    const quest = sample(CASE_QUESTS); currentMock={ mode, title:`午後ミニ模試：${quest.title}`, questions:quest.questions.map(q=>({...q, id:null, monster:quest.monster, difficulty:q.boss?'ボス':'午後'})), index:0, correct:0 };
  } else {
    let pool = allQuestions();
    if (mode === 'weak') {
      const lows=CATEGORIES.map(c=>({c,p:pct(stats.byCategory[c]?.correct||0,stats.byCategory[c]?.total||0),n:stats.byCategory[c]?.total||0})).sort((a,b)=>a.p-b.p).slice(0,3).map(x=>x.c);
      const weak=pool.filter(q=>lows.includes(q.category)); if(weak.length>=6) pool=weak;
    }
    currentMock={ mode, title:mode==='weak'?'弱点集中模試':'午前ミニ模試', questions:shuffle(pool).slice(0, mode==='weak'?10:15), index:0, correct:0 };
  }
  showMockQuestion();
}
function showMockQuestion() {
  const m=currentMock; if (m.index>=m.questions.length) return finishMock();
  const q=m.questions[m.index]; showScreen('mockBattleScreen');
  $('mockMode').textContent='模擬試験'; $('mockTitle').textContent=m.title; $('mockProgress').textContent=`${m.index+1}/${m.questions.length}`; $('mockImage').src=monsterFor(q).image; $('mockLog').textContent='本番っぽく、まずは自力で選ぶ。解説は直後に確認。'; $('mockScoreChip').textContent=`${m.correct}正解`; $('mockCategory').textContent=q.category; $('mockDifficulty').textContent=q.difficulty||q.type||'標準'; $('mockQuestionText').textContent=q.question; $('mockHint').textContent=q.context||'';
  $('mockChoices').innerHTML=q.choices.map((choice,i)=>`<button class="choice-btn" type="button" data-choice="${i}">${String.fromCharCode(65+i)}. ${choice}</button>`).join('');
  $('mockChoices').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>handleMockAnswer(Number(btn.dataset.choice))));
}
function handleMockAnswer(choiceIndex) {
  const q=currentMock.questions[currentMock.index]; const ok=choiceIndex===q.answer;
  document.querySelectorAll('#mockChoices .choice-btn').forEach((b,i)=>{ b.disabled=true; if(i===q.answer)b.classList.add('correct'); if(i===choiceIndex&&!ok)b.classList.add('wrong'); });
  if(ok){ currentMock.correct++; flash('mockDamagePop','+1'); beep('ok'); } else beep('bad');
  recordAnswer(q, ok);
  $('mockScoreChip').textContent=`${currentMock.correct}正解`;
  pendingNext=()=>{ closeModal('explainModal'); currentMock.index++; showMockQuestion(); };
  showExplanation(ok, q, q.choices[choiceIndex]);
}
function finishMock() {
  const total=currentMock.questions.length; const score=pct(currentMock.correct,total); const exp=currentMock.correct*18+(score>=70?80:20);
  stats.exp+=exp; stats.mockHistory=stats.mockHistory||[]; stats.mockHistory.unshift({ title:currentMock.title, mode:currentMock.mode, score, correct:currentMock.correct, total, at:todayKey() }); stats.mockHistory=stats.mockHistory.slice(0,30);
  logStudy('mock', currentMock.correct, total); saveStats();
  $('resultBadge').textContent='模試結果'; $('resultTitle').textContent=score>=70?'いい感じ！':'まだ伸びる！'; $('resultMessage').textContent=score>=70?'合格ラインに近い手応え。弱点を復習するとさらに安定します。':'低かった分野を探索と因縁モンスターで潰しましょう。'; $('resultCorrect').textContent=`${currentMock.correct}/${total}`; $('resultMiddleLabel').textContent='スコア'; $('resultFloor').textContent=`${score}%`; $('resultExp').textContent=String(exp); $('resultExtra').innerHTML=`合格可能性：${computePassScore()}%`; $('retryBtn').onclick=()=>startMock(currentMock.mode); showScreen('resultScreen');
}

function renderCalendar() {
  const now=new Date(); const y=now.getFullYear(); const m=now.getMonth();
  $('calendarTitle').textContent = `${y}年${m+1}月`;
  const first=new Date(y,m,1); const last=new Date(y,m+1,0); const blanks=first.getDay();
  const cells=[]; for(let i=0;i<blanks;i++) cells.push('<div class="day-cell blank"></div>');
  let learned=0;
  for(let day=1; day<=last.getDate(); day++) {
    const d=new Date(y,m,day); const key=todayKey(d); const log=stats.dailyLog[key]; if(log?.sessions) learned++;
    const mark = !log ? '' : log.mock ? '★ 模試' : log.questions>=30 ? '◎ 30問+' : log.questions>=10 ? '○ 10問+' : `• ${log.questions||0}問`;
    cells.push(`<div class="day-cell ${key===todayKey()?'today':''}"><span class="day-num">${day}</span><span class="muted">${log?`${log.correct||0}/${log.questions||0}`:''}</span><span class="day-mark">${mark}</span></div>`);
  }
  $('calendarGrid').innerHTML=cells.join(''); $('calendarSummary').textContent=`${learned}日学習`;
  const today=stats.dailyLog[todayKey()]; $('todayLog').textContent = today ? `今日は ${today.questions}問中${today.correct}問正解、セッション${today.sessions}回。${today.mock?'模試も実施済み。':''}` : '今日はまだ学習ログがありません。1問だけでも倒しておくと連続学習がつきます。';
}

function renderCustomQuestions() {
  const list=stats.customQuestions||[];
  $('customQuestionList').innerHTML = list.length ? list.map(q=>`<div class="custom-item"><b>${q.category}</b>：${q.question}<br><span class="muted">正解：${String.fromCharCode(65+q.answer)} / ${q.source||'自作'}</span></div>`).join('') : '<p class="muted">追加問題はまだありません。</p>';
}
function saveCustomQuestion(e) {
  e.preventDefault();
  const q={ id:`custom_${Date.now()}`, category:$('editCategory').value, monster:CATEGORY_MONSTER[$('editCategory').value]||'sql', difficulty:'自作', question:$('editQuestion').value.trim(), choices:[$('editA').value.trim(),$('editB').value.trim(),$('editC').value.trim(),$('editD').value.trim()], answer:Number($('editAnswer').value), explanation:$('editExplanation').value.trim(), source:$('editSource').value.trim()||'自作問題' };
  if(!q.question || q.choices.some(c=>!c) || !q.explanation) return alert('未入力の項目があります。');
  stats.customQuestions=stats.customQuestions||[]; stats.customQuestions.unshift(q); saveStats(); e.target.reset(); renderCustomQuestions(); showEvent('問題を保存しました', '探索・模試の問題プールに追加されました。自分用の弱点問題集、いいやつです。', ()=>closeModal('eventModal'), '保存');
}

function renderAnalytics() {
  const pass=computePassScore(); $('passScoreBig').textContent=`${pass}%`; $('passMeter').style.width=pass+'%';
  $('passComment').textContent = pass>=80?'かなり仕上がっています。模試と午後事件で精度維持へ。': pass>=60?'合格圏に近づいています。弱点分野と模試70%以上を狙いましょう。': pass>=35?'土台はでき始めています。まずは分野の穴を小さくしましょう。':'まだ序盤。10問探索と復習ループから始めるのが近道です。';
  $('categoryStats').innerHTML = CATEGORIES.map(cat => { const c=stats.byCategory[cat]||{total:0,correct:0}; const p=pct(c.correct,c.total); return `<div class="category-row"><span>${cat}</span><div class="meter"><i style="width:${p}%"></i></div><b>${p}%</b></div>`; }).join('');
  const unlocked = new Set(unlockedTitles().map(t=>t.id));
  $('allTitles').innerHTML = ACHIEVEMENTS.map(t => `<div class="title-badge ${unlocked.has(t.id)?'':'locked'}">${t.icon} <span><b>${t.name}</b><br><small>${t.desc}</small></span></div>`).join('');
  $('wrongListText').textContent = stats.wrongIds.length ? `${stats.wrongIds.length}問：${stats.wrongIds.slice(0,8).map(id => byId(id)?.question || id).join(' / ')}` : 'まだ因縁モンスターはいません。すごい、平和な世界。';
}

function bindEvents() {
  $('startDungeonBtn').addEventListener('click',()=>showScreen('dungeonScreen'));
  $('caseQuestBtn').addEventListener('click',()=>showScreen('caseListScreen'));
  $('reviewBtn').addEventListener('click',()=>startRun('mixed',true));
  $('reviewFromStatsBtn').addEventListener('click',()=>startRun('mixed',true));
  $('mockBtn').addEventListener('click',()=>showScreen('mockScreen'));
  $('editorBtn').addEventListener('click',()=>showScreen('editorScreen'));
  $('calendarBtn').addEventListener('click',()=>showScreen('calendarScreen'));
  $('soundToggle').addEventListener('click',()=>{ soundOn=!soundOn; $('soundToggle').textContent=soundOn?'🔈':'🔇'; });
  $('nextBtn').addEventListener('click',()=>pendingNext?.()); $('eventNextBtn').addEventListener('click',()=>pendingNext?.());
  $('startJudgementBtn').addEventListener('click',startCaseJudgement);
  $('autoOpenEvidenceBtn').addEventListener('click',()=>{ currentCaseRun.opened=currentCaseRun.quest.evidence.map((_,i)=>i); renderCaseScreen(); });
  $('questionForm').addEventListener('submit',saveCustomQuestion);
  $('clearCustomBtn').addEventListener('click',()=>{ if(confirm('追加した問題を全て削除しますか？')) { stats.customQuestions=[]; saveStats(); renderCustomQuestions(); } });
  $('resetBtn').addEventListener('click',()=>{ if(confirm('成績・問題エディタ・履歴を全てリセットしますか？')) { stats=baseStats(); saveStats(); showScreen('homeScreen'); } });
  document.body.addEventListener('click',(e)=>{
    const nav=e.target.closest('[data-nav]'); if(nav) return showScreen(nav.dataset.nav);
    const action=e.target.closest('[data-action]'); if(action){ if(action.dataset.action==='home') return showScreen('homeScreen'); if(action.dataset.action==='caseList') return showScreen('caseListScreen'); }
    const d=e.target.closest('[data-dungeon]'); if(d) return startRun(d.dataset.dungeon,false);
    const room=e.target.closest('[data-room]'); if(room) return enterRoom(room.dataset.room);
    const c=e.target.closest('[data-case]'); if(c) return startCase(c.dataset.case);
    const mock=e.target.closest('[data-mock]'); if(mock) return startMock(mock.dataset.mock);
  });
}

bindEvents();
renderDungeons();
renderCases();
updateHome();
