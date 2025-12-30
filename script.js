/* ===========
  Assets map
=========== */
const ASSETS = {
  // Dialogue frames
  frames: {
    storyteller: "assets/Storyteller.png",
    kate: "assets/KateLine.png",
    other: "assets/OtherLine.png",
  },

  // Inventory
  inventory: {
    bracelet: "assets/Podarok.png",
  },

  // Backgrounds
  bg: {
    Bedroom: "assets/Bedroom.png",
    PoleNight: "assets/PoleNight.png",
    PoleDay: "assets/PoleDay.png",
    Cave: "assets/Cave.png",
    Church: "assets/Church.png",
    Amour: "assets/Amour.png",
  },

  // Cutscenes (images)
  cut: {
    t2355: "assets/2355.png",
    t0000: "assets/0000.png",
    t0001: "assets/0001.png",
    t0010: "assets/0010.png",
    t0020: "assets/0020.png",
    t0030: "assets/0030.png",
    Sms: "assets/Sms.png",

    Captive: "assets/Captive.png",
    Invitation: "assets/Invitation.png",
    Dance: "assets/Dance.png",
    Surprise: "assets/Surprise.png",
    Hug: "assets/Hug.png",
  },

  // Cutscene (video)
  video: {
    Whirlpool: "assets/Whirlpool.mp4",
  },

  // Music
  music: {
    Bedroom: "assets/Bedroom.mp3",
    Worried: "assets/Worried.mp3",
    Sms: "assets/Sms.mp3",
    Pole: "assets/Pole.mp3",
    Run: "assets/Run.mp3",
    Dance: "assets/Dance.mp3",
    GPT: "assets/GPT.mp3",
  },

  // Characters (emotions)
  chars: {
    Kate: {
      Neutral: "assets/NeutralKate.png",
      Skeptical: "assets/SkepticalKate.png",
      Touched: "assets/TouchedKate.png",
      Joy: "assets/JoyKate.png",
    },
    Stacy: {
      Neutral: "assets/NeutralStacy.png",
      Cunning: "assets/CunningStacy.png",
      Angry: "assets/AngryStacy.png",
      Happy: "assets/HappyStacy.png",
    },
    Mary: {
      Neutral: "assets/NeutralMary.png",
      Dissatisfied: "assets/DissatisfiedMary.png",
      Cunning: "assets/CunningMary.png",
      Happy: "assets/HappyMary.png",
    },
    Sandra: {
      Neutral: "assets/NeutralSandra.png",
      Skeptical: "assets/SkepticalSandra.png",
      Cunning: "assets/CunningSandra.png",
      Joy: "assets/JoySandra.png",
    },
    Ravi: {
      Joy: "assets/JoyRavi.png",
      Interested: "assets/InterestedRavi.png",
    },
    Adi: { Base: "assets/Adi.png" },
    Semi: { Base: "assets/Semi.png" },
    Hunger: { Base: "assets/Hunger.png" },
    GPT: { Base: "assets/GPT.png" },
  }
};

/* ===========
  DOM
=========== */
const bgEl = document.getElementById("bg");
const overlayEl = document.getElementById("overlay");

const charLeft = document.getElementById("charLeft");
const charRight = document.getElementById("charRight");

const dialogueFrame = document.getElementById("dialogueFrame");
const namePlate = document.getElementById("namePlate");
const textEl = document.getElementById("text");

const btnNext = document.getElementById("btnNext");
const btnBack = document.getElementById("btnBack");

const choicesEl = document.getElementById("choices");
const choicesTitle = document.getElementById("choicesTitle");
const choicesList = document.getElementById("choicesList");

const videoLayer = document.getElementById("videoLayer");
const cutVideo = document.getElementById("cutVideo");

const bgm = document.getElementById("bgm");

const inventoryEl = document.getElementById("inventory");
const invItemBtn = document.getElementById("invItem");
const invIcon = document.getElementById("invIcon");

const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalImg = document.getElementById("modalImg");
const modalText = document.getElementById("modalText");
const modalInspect = document.getElementById("modalInspect");

/* ===========
  Helpers
=========== */
function setBg(path){
  bgEl.style.backgroundImage = `url("${path}")`;
}

function setOverlay(mode){
  // mode: "none" | "dim" | "fadeIn"
  overlayEl.classList.remove("hidden", "dim", "fadeIn");
  if (mode === "none") overlayEl.classList.add("hidden");
  else overlayEl.classList.add(mode);
}

function setChar(slot, imgPath){
  const el = slot === "left" ? charLeft : charRight;
  if (!imgPath){
    el.classList.add("hidden");
    el.src = "";
    return;
  }
  el.src = imgPath;
  el.classList.remove("hidden");
}

function frameForSpeaker(speaker){
  if (speaker === "Оповідач") return ASSETS.frames.storyteller;
  if (speaker === "Катюнчік") return ASSETS.frames.kate;
  return ASSETS.frames.other;
}

function setDialogue(speaker, line){
  dialogueFrame.src = frameForSpeaker(speaker);

  if (speaker === "Оповідач"){
    namePlate.classList.add("hidden");
  } else {
    namePlate.classList.remove("hidden");
    namePlate.textContent = speaker;
  }

  textEl.textContent = line;
}

let currentMusic = null;
async function playMusic(path){
  if (!path) return;

  if (currentMusic === path && !bgm.paused) return;

  currentMusic = path;
  bgm.pause();
  bgm.currentTime = 0;
  bgm.src = path;
  bgm.loop = true;
  bgm.volume = 0.65;

  try { await bgm.play(); } catch(e) {
    // autoplay may fail until first interaction; will retry on Next
  }
}

function showChoices(title, options){
  choicesTitle.textContent = title || "Оберіть варіант";
  choicesList.innerHTML = "";
  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "choiceBtn";
    btn.textContent = opt.text;
    btn.onclick = () => {
      hideChoices();
      jumpTo(opt.next);
    };
    choicesList.appendChild(btn);
  });
  choicesEl.classList.remove("hidden");
}

function hideChoices(){
  choicesEl.classList.add("hidden");
}

function showModal(img, text){
  modalImg.src = img;
  modalText.textContent = text || "";
  modal.classList.remove("hidden");
}
function hideModal(){
  modal.classList.add("hidden");
}

modalClose.onclick = hideModal;
modal.onclick = (e) => { if (e.target === modal) hideModal(); };

let braceletInspected = false;
modalInspect.onclick = () => {
  braceletInspected = true;
  modalText.textContent = "Срібло холодить шкіру… а сині камінці ніби світяться зсередини. Це не сон.";
  modalInspect.textContent = "Розглянуто ✓";
  modalInspect.disabled = true;
};

/* ===========
  VN Data
=========== */
/*
  Position rule:
  - normal scenes: Катюнчік LEFT, others RIGHT
  - flashback (friends story) where gg absent: Машечка RIGHT, others LEFT
*/
function imgChar(who, mood){
  const c = ASSETS.chars[who];
  if (!c) return null;
  if (typeof c === "string") return c;
  if (c[mood]) return c[mood];
  if (c.Base) return c.Base;
  return null;
}

const STATE = {
  haveBracelet: false
};

function grantBracelet(){
  STATE.haveBracelet = true;
  inventoryEl.classList.remove("hidden");
  invIcon.src = ASSETS.inventory.bracelet;
}

invItemBtn.onclick = () => {
  showModal(ASSETS.inventory.bracelet, braceletInspected
    ? "Ви вже роздивилися браслет."
    : "На вигляд — просто прикраса. На ділі — доказ, що все сталося насправді.");
};

/* ===========
  Script nodes
=========== */

const NODES = [
  // ===== Scene: Bedroom start =====
  { id:"s1_bg", type:"scene", bg: ASSETS.bg.Bedroom, music: ASSETS.music.Bedroom, dim:"none" },

  { id:"s1_cut_2355", type:"cutscene_img", img: ASSETS.cut.t2355, dim:"fadeIn" },
  { id:"s1_n1", type:"say", speaker:"Оповідач",
    left: { who:"Kate", mood:"Neutral" },
    right: null,
    text:"На годиннику 23:55." },

  { id:"s1_n2", type:"say", speaker:"Оповідач",
    text:"Вона знала, що зовсім скоро все почнеться — те, чого вона найбільше сьогодні чекала." },

  { id:"s1_n3", type:"say", speaker:"Оповідач",
    text:"Північ. Час, який завжди мав для неї значення. Час, коли світ ніби на мить зупинявся, щоб нагадати: сьогодні — її день." },

  { id:"s1_n4", type:"say", speaker:"Оповідач",
    text:"Вона не дивилася на годинник із хвилюванням. Ні. Швидше — з теплою, знайомою впевненістю. Бо так було завжди." },

  // 00:00
  { id:"s1_cut_0000", type:"cutscene_img", img: ASSETS.cut.t0000, dim:"fadeIn" },
  { id:"s1_n5", type:"say", speaker:"Оповідач",
    text:"00:00." },

  // 00:01
  { id:"s1_cut_0001", type:"cutscene_img", img: ASSETS.cut.t0001, dim:"fadeIn" },
  { id:"s1_n6", type:"say", speaker:"Оповідач",
    text:"Зазвичай ці хвилини були наповнені приємним хвилюванням: вібрацією телефону, сміхом у голосових, поспішними повідомленнями з помилками — написаними занадто швидко від емоцій." },

  { id:"s1_n7", type:"say", speaker:"Оповідач",
    text:"Але не сьогодні… Вона відчувала: щось трапилось. Ніхто їй не написав. Не подзвонив. Таке було вперше." },

  { id:"s1_k1", type:"say", speaker:"Катюнчік",
    left: { who:"Kate", mood:"Neutral" },
    text:"«Мабуть, просто ще не встигли. Вони ж завжди трохи спізнюються — це в їхньому стилі»." },

  // 00:10
  { id:"s1_cut_0010", type:"cutscene_img", img: ASSETS.cut.t0010, dim:"fadeIn" },
  { id:"s1_n8", type:"say", speaker:"Оповідач",
    text:"Вона посміхається сама до себе — ніби може переконати тишу зрушити з місця. Проте десь глибоко всередині щось ледь помітно здригнулося." },

  // 00:20
  { id:"s1_cut_0020", type:"cutscene_img", img: ASSETS.cut.t0020, dim:"fadeIn" },
  { id:"s1_k2", type:"say", speaker:"Катюнчік",
    left: { who:"Kate", mood:"Skeptical" },
    text:"«Дивно… Невже про мене забули?»" },

  { id:"s1_n9", type:"say", speaker:"Оповідач",
    text:"Вперше тиша не була приємною. Вона була занадто гучною — і тиснула своєю безнадійністю." },

  // 00:30
  { id:"s1_cut_0030", type:"cutscene_img", img: ASSETS.cut.t0030, dim:"fadeIn" },
  { id:"s1_n10", type:"say", speaker:"Оповідач",
    text:"І в цю мить у її серці з’явилися відчуття, які вона не хотіла визнавати…" },

  { id:"s1_n11", type:"say", speaker:"Оповідач",
    text:"Самотність. Печаль. Образа. Відчай." },

  { id:"s1_n12", type:"say", speaker:"Оповідач",
    text:"Вона вже сумнівалася, чи варто чекати далі. Чи є в цьому сенс." },

  // SMS arrives
  { id:"s1_music_sms", type:"music", music: ASSETS.music.Sms },
  { id:"s1_n13", type:"say", speaker:"Оповідач",
    text:"Та звук щойно надісланого повідомлення вирвав її з роздумів." },

  { id:"s1_n14", type:"say", speaker:"Оповідач",
    text:"Вона ледь здригнулась. Не від страху — від несподіванки." },

  { id:"s1_sms1", type:"say", speaker:"Невідоме смс",
    right: { who:null, mood:null },
    text:"«Приходь, якщо хочеш знати правду!»" },

  { id:"s1_k3", type:"say", speaker:"Катюнчік",
    left: { who:"Kate", mood:"Skeptical" },
    text:"«Що за…? Це якийсь прикол? Не дуже схоже на привітання»." },

  { id:"s1_cut_sms", type:"cutscene_img", img: ASSETS.cut.Sms, dim:"fadeIn" },
  { id:"s1_n15", type:"say", speaker:"Оповідач",
    text:"Вона перечитує повідомлення ще раз і ще раз. Без погроз, без пояснень — але з дивною впевненістю, ніби хтось знає: вона прочитає і замислиться." },

  { id:"s1_k4", type:"say", speaker:"Катюнчік",
    text:"«Ага, дуже смішно. Вночі. У мій день народження. Ну-ну»." },

  { id:"s1_n16", type:"say", speaker:"Оповідач",
    text:"Вона уважно розглядає геолокацію — і холоне. Це було поле неподалік дому. Місце знайоме до болю. І саме це лякало найбільше." },

  // Choice 1: ignore or go
  { id:"ch1", type:"choice", title:"Що зробити?", options:[
    { text:"Проігнорувати повідомлення", next:"ch1_ignore_1" },
    { text:"Піти подивитися", next:"ch1_go_1" },
  ]},

  // Ignore branch
  { id:"ch1_ignore_1", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Skeptical"},
    text:"«Ні. Я не поведуся на це. Це точно чийсь дурний жарт»." },

  { id:"ch1_ignore_2", type:"say", speaker:"Оповідач",
    text:"Вона відкладає телефон на стіл і намагається заснути. Але сон не йде. Наче щось тримає її за край думок і не відпускає." },

  { id:"ch1_ignore_3", type:"say", speaker:"Оповідач",
    text:"Кожна хвилина здається довшою за попередню. І думки повертаються до одного і того ж: а що, якщо це не жарт?" },

  { id:"ch1_ignore_4", type:"say", speaker:"Невідоме смс",
    text:"«Ти справді хочеш залишитись?»" },

  { id:"ch1_ignore_5", type:"say", speaker:"Катюнчік",
    text:"«Та ну вас…»" },

  { id:"ch1_ignore_6", type:"say", speaker:"Оповідач",
    text:"Вона все ж підводиться з ліжка. Нашвидку одягається — і виходить туди, куди її кличе невідомість." },

  { id:"ch1_ignore_merge", type:"jump", next:"field_night_1" },

  // Go branch
  { id:"ch1_go_1", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Neutral"},
    text:"«Якщо це жарт — я просто повернуся додому. Але якщо ні…»" },

  { id:"ch1_go_2", type:"say", speaker:"Оповідач",
    text:"Вона вдягається швидко. Не тому, що боїться — а тому, що відчуває: ця ніч не дасть їй спокою." },

  { id:"ch1_go_merge", type:"jump", next:"field_night_1" },

  // ===== Night Field =====
  { id:"field_night_1", type:"scene", bg: ASSETS.bg.PoleNight, music: ASSETS.music.Pole, dim:"none" },

  { id:"field_night_2", type:"say", speaker:"Оповідач",
    left:{who:"Kate", mood:"Skeptical"},
    text:"Поле зустріло її холодом. Ніч — ясними зірками, ніби хтось навмисно лишив світло увімкненим." },

  { id:"field_night_3", type:"say", speaker:"Катюнчік",
    text:"Тааак… І що тепер?" },

  { id:"field_night_4", type:"say", speaker:"Оповідач",
    text:"Вітер раптово посилився. Хмари почали рухатися не так, як повинні. Яскраве світло на секунду осліпило її — і найбільше лякало те, звідки взялося його джерело." },

  // Video whirlpool
  { id:"field_night_video", type:"cutscene_video", video: ASSETS.video.Whirlpool },

  { id:"field_night_5", type:"say", speaker:"Оповідач",
    text:"Розплющивши очі, вона побачила неподалік вир. Не страшний — навпаки привабливий. Він притягував погляд, гіпнотизував, манив підійти ближче." },

  { id:"field_night_6", type:"say", speaker:"Катюнчік",
    text:"Та ну на… Це реально?!" },

  { id:"field_night_7", type:"say", speaker:"Катюнчік",
    text:"«Я про таке тільки читала… бути не може»." },

  { id:"field_night_8", type:"say", speaker:"Оповідач",
    text:"Вона про таке тільки читала. Колись давно. У вигаданій історії, яка, здається, зараз дуже навіть реальна." },

  // Choice 2: step back or approach
  { id:"ch2", type:"choice", title:"Що зробити біля виру?", options:[
    { text:"Злякатися й відійти", next:"ch2_back_1" },
    { text:"Зібратися і підійти ближче", next:"ch2_go_1" },
  ]},

  { id:"ch2_back_1", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Skeptical"},
    text:"Щось якось… не дуже безпечно виглядає. Наче…" },

  { id:"ch2_back_2", type:"say", speaker:"Катюнчік",
    text:"Відійду я, заради Бога, подалі." },

  { id:"ch2_back_3", type:"say", speaker:"Катюнчік",
    text:"Так. Зібралась. Взяла себе в руки. Відставити паніку!" },

  { id:"ch2_back_4", type:"say", speaker:"Катюнчік",
    text:"Назад шляху нема… з Богом." },

  { id:"ch2_back_merge", type:"jump", next:"flashback_title" },

  { id:"ch2_go_1", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Neutral"},
    text:"Нуу… живемо один раз. З Богом, як то кажуть." },

  { id:"ch2_go_merge", type:"jump", next:"flashback_title" },

  // ===== Flashback: title =====
  { id:"flashback_title", type:"say", speaker:"Оповідач",
    left:{who:"Kate", mood:"Neutral"},
    text:"《За день до того》" },

  // ===== Flashback scene in day field =====
  { id:"flash_day_bg", type:"scene", bg: ASSETS.bg.PoleDay, music: ASSETS.music.Pole, dim:"none" },

  { id:"flash_day_1", type:"say", speaker:"Оповідач",
    // gg absent => Mary RIGHT, others LEFT
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Іноді дива не приходять до тих, хто на них чекає. Вони знаходять тих, хто готовий ризикнути — навіть не розуміючи, чим усе закінчиться." },

  { id:"flash_day_2", type:"say", speaker:"Оповідач",
    text:"За день до її дня народження, коли світ ще жив звичайним ритмом, вони побачили те, чого не мало б існувати." },

  { id:"flash_day_3", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Слухайте, дівчулі, а як ми Катюнчіка будемо вітати? Є варіанти?" },

  { id:"flash_day_4", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ем…" },

  { id:"flash_day_5", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"М…" },

  { id:"flash_day_6", type:"say", speaker:"Оповідач",
    text:"Раві уважно переводила погляд з однієї на іншу, ніби теж намагалася придумати план." },

  { id:"flash_day_7", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"І я такої думки…" },

  { id:"flash_day_8", type:"say", speaker:"Настьона",
    text:"Боже, дай сил щось придумати." },

  { id:"flash_day_9", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"А може ми їй відео з привітанням зробимо? М?" },

  { id:"flash_day_10", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Звучить класно, але свято завтра… це ж треба ідею, зняти, змонтувати. Нам потрібен час, а його нема." },

  { id:"flash_day_11", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Окей. Я записую про відео на наступний рік. Наступного року — знищимо її емоційно." },

  { id:"flash_day_12", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"А що тоді будемо робити?" },

  { id:"flash_day_13", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Може їй історію напишемо? Про неї." },

  { id:"flash_day_14", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"А час є?" },

  { id:"flash_day_15", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Та немає…" },

  { id:"flash_day_16", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Відкладаємо на кращі часи. Там треба і малювати, і писати, і музику робити… це вже масштабніше." },

  { id:"flash_day_17", type:"say", speaker:"Оповідач",
    text:"Раві тихенько гавкнула — і всі одночасно обернулися." },

  { id:"flash_day_18", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Що таке, Раві? Хто там?" },

  { id:"flash_day_19", type:"say", speaker:"Оповідач",
    text:"Не “хто”. “Що”." },

  { id:"flash_day_20", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Angry"},
    right:{who:"Mary", mood:"Neutral"},
    text:"А…?" },

  { id:"flash_day_21", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Skeptical"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Аху…" },

  { id:"flash_day_22", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Skeptical"},
    text:"Та ну на…" },

  { id:"flash_day_23", type:"say", speaker:"Оповідач",
    text:"Посеред звичного поля — вир. Денний. Нереальний. Той, який не має права існувати." },

  { id:"flash_day_24", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Дівчулі… а ми ж про таке читали. Пам’ятаєте?" },

  { id:"flash_day_25", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ми перевіримо, що воно там?" },

  { id:"flash_day_26", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Skeptical"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Та щось не дуже й хочеться…" },

  { id:"flash_day_27", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Cunning"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Живемо один раз. Не підемо — все життя будемо шкодувати." },

  { id:"flash_day_28", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Вмовила…" },

  { id:"flash_day_29", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"З Богом!" },

  // ===== Flashback: Church =====
  { id:"flash_church_bg", type:"scene", bg: ASSETS.bg.Church, music: ASSETS.music.Worried, dim:"none" },

  { id:"flash_church_1", type:"say", speaker:"Оповідач",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Світ, у який вони потрапили, не кричав про свою велич. Він просто існував — стародавній, величний, байдужий до людських страхів." },

  { id:"flash_church_2", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Angry"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Якщо це галюцинації, то я подам в суд на Ваню! Раз в тисячу років пригостив нас своїм “кулінарним шедевром” — і ми вже на небесах!" },

  { id:"flash_church_3", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Joy"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Пхах!" },

  { id:"flash_church_4", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Joy"},
    text:"І смішно, і грішно." },

  { id:"flash_church_5", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Angry"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Бог простить. А я запам’ятаю. Доберусь я тільки до нього." },

  { id:"flash_church_6", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"А може, то все-таки не він винен?" },

  { id:"flash_church_7", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Та навіть якщо й не він — треба ж на когось спихнути." },

  { id:"flash_church_8", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Joy"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Нуу… логічно." },

  { id:"flash_church_9", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Angry"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ми проповідуємо ідеологію Катюнчіка: що б не сталося — винний Ваня. Амінь." },

  { id:"flash_church_10", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Нам би ще зрозуміти, де ми…" },

  { id:"flash_church_11", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"У церкві." },

  { id:"flash_church_12", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Angry"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ну звичайно. Куди ж я і без церкви — церква і без мене. Іронія долі." },

  { id:"flash_church_13", type:"say", speaker:"Оповідач",
    text:"Їхній сміх швидко заглух — бо в тінях хтось був." },

  // introduce Adi / Semi
  { id:"flash_church_14", type:"say", speaker:"Аді",
    left:{who:"Adi", mood:"Base"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Воу-воу, полегше, смертні." },

  { id:"flash_church_15", type:"say", speaker:"Семі",
    left:{who:"Semi", mood:"Base"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Не лякай їх." },

  { id:"flash_church_16", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Skeptical"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ви хто?" },

  { id:"flash_church_17", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ну хто… ми ж наче як бачимо, ні?" },

  { id:"flash_church_18", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Логічно." },

  { id:"flash_church_19", type:"say", speaker:"Семі",
    left:{who:"Semi", mood:"Base"},
    right:{who:"Mary", mood:"Neutral"},
    text:"А ви хто?" },

  { id:"flash_church_20", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ті, хто і ви… тільки без крил." },

  { id:"flash_church_21", type:"say", speaker:"Аді",
    left:{who:"Adi", mood:"Base"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ахахаха. А вони мені подобаються." },

  { id:"flash_church_22", type:"say", speaker:"Оповідач",
    text:"Саме тоді в головах дівчат з’явилася ідея. Небезпечна. Абсурдна. І… ідеальна." },

  { id:"flash_church_23", type:"say", speaker:"Оповідач",
    text:"Якщо це той світ, про який Катюнчік читала у новелі — значить, Голод існує насправді." },

  { id:"flash_church_24", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Cunning"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Хлопці, а можна одне питання?" },

  { id:"flash_church_25", type:"say", speaker:"Аді",
    left:{who:"Adi", mood:"Base"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ну, спробуй." },

  { id:"flash_church_26", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Cunning"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Голод теж тут?" },

  { id:"flash_church_27", type:"say", speaker:"Семі",
    left:{who:"Semi", mood:"Base"},
    right:{who:"Mary", mood:"Neutral"},
    text:"А звідки ти…" },

  { id:"flash_church_28", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Cunning"},
    right:{who:"Mary", mood:"Neutral"},
    text:"У нас свої джерела інформації. Хто ж знав, що ваш світ існує." },

  { id:"flash_church_29", type:"say", speaker:"Аді",
    left:{who:"Adi", mood:"Base"},
    right:{who:"Mary", mood:"Neutral"},
    text:"А Голод вам навіщо?" },

  { id:"flash_church_30", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Cunning"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"А якщо… ми приведемо його до неї?" },

  { id:"flash_church_31", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Cunning"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ооо." },

  { id:"flash_church_32", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Cunning"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Ооо." },

  { id:"flash_church_33", type:"say", speaker:"Семі",
    left:{who:"Semi", mood:"Base"},
    right:{who:"Mary", mood:"Neutral"},
    text:"А?" },

  { id:"flash_church_34", type:"say", speaker:"Аді",
    left:{who:"Adi", mood:"Base"},
    right:{who:"Mary", mood:"Neutral"},
    text:"…" },

  { id:"flash_church_35", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Cunning"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Не підкажете, де він?" },

  { id:"flash_church_36", type:"say", speaker:"Оповідач",
    text:"Небожителі погодилися допомогти — з цікавості. Люди були для них дивною, шумною, але дуже живою пригодою." },

  // Hunger dialogue in flashback (no face change needed)
  { id:"flash_hunger_1", type:"say", speaker:"Оповідач",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Hunger", mood:"Base"},
    text:"Голод вислухав їх мовчки. Його погляд був холодним. Порожнім." },

  { id:"flash_hunger_2", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Hunger", mood:"Base"},
    text:"Ми ж не просимо зірку з неба дістати…" },

  { id:"flash_hunger_3", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Neutral"},
    right:{who:"Hunger", mood:"Base"},
    text:"Будь ласка…" },

  { id:"flash_hunger_4", type:"say", speaker:"Голод",
    left:{who:"Stacy", mood:"Neutral"},
    right:{who:"Hunger", mood:"Base"},
    text:"Людські свята не мають для мене значення. Ідіть." },

  { id:"flash_hunger_5", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Dissatisfied"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Але…" },

  { id:"flash_hunger_6", type:"say", speaker:"Голод",
    right:{who:"Hunger", mood:"Base"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Ви мене почули." },

  { id:"flash_hunger_7", type:"say", speaker:"Оповідач",
    text:"Вони пішли. Злі. Виснажені. Але не зломлені. І саме тоді народився план Б." },

  { id:"flash_planb_1", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Cunning"},
    right:{who:"Mary", mood:"Cunning"},
    text:"Не хоче по-хорошому — буде по-нашому." },

  { id:"flash_planb_2", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Cunning"},
    right:{who:"Adi", mood:"Base"},
    text:"Аді, Семі… а не допоможете його трошки… поневолити? Будь ласочка." },

  { id:"flash_planb_3", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Cunning"},
    right:{who:"Semi", mood:"Base"},
    text:"Десь на пару годин." },

  { id:"flash_planb_4", type:"say", speaker:"Семі",
    left:{who:"Semi", mood:"Base"},
    right:{who:"Mary", mood:"Cunning"},
    text:"Ви впевнені?" },

  { id:"flash_planb_5", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Cunning"},
    left:{who:"Sandra", mood:"Cunning"},
    text:"Ні. Але спробувати треба." },

  { id:"flash_planb_6", type:"say", speaker:"Аді",
    left:{who:"Adi", mood:"Base"},
    right:{who:"Mary", mood:"Neutral"},
    text:"Вмовили." },

  // Cave + captive cutscene
  { id:"cave_bg", type:"scene", bg: ASSETS.bg.Cave, music: ASSETS.music.Worried, dim:"none" },
  { id:"cave_cut", type:"cutscene_img", img: ASSETS.cut.Captive, dim:"fadeIn" },

  { id:"cave_1", type:"say", speaker:"Оповідач",
    left:{who:"Stacy", mood:"Cunning"},
    right:{who:"Hunger", mood:"Base"},
    text:"Магічні нитки стримували силу всадника апокаліпсису. Не назавжди. Але достатньо довго." },

  { id:"cave_2", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Ми просимо. Серйозно. Це просто танець. Один єдиний вечір." },

  { id:"cave_3", type:"say", speaker:"Голод",
    right:{who:"Hunger", mood:"Base"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Ви не розумієте, з чим граєтеся." },

  { id:"cave_4", type:"say", speaker:"Сашечка",
    left:{who:"Sandra", mood:"Cunning"},
    right:{who:"Hunger", mood:"Base"},
    text:"Можливо. Але ми вміємо бути дуже переконливими." },

  { id:"cave_5", type:"say", speaker:"Оповідач",
    text:"І симфонія хаотичних голосів, сміху, галасу — розбудила б навіть мертвого. А що вже говорити про безсмертних." },

  { id:"cave_6", type:"say", speaker:"Оповідач",
    text:"Терпіння Голода було безмежним. Але навіть у безмежності є межа." },

  { id:"cave_7", type:"say", speaker:"Голод",
    right:{who:"Hunger", mood:"Base"},
    left:{who:"Stacy", mood:"Cunning"},
    text:"Гаразд. Я піду." },

  { id:"cave_8", type:"say", speaker:"Настьона",
    left:{who:"Stacy", mood:"Happy"},
    right:{who:"Mary", mood:"Happy"},
    text:"Ми такі раді! Дякуємо!" },

  { id:"cave_9", type:"say", speaker:"Голод",
    right:{who:"Hunger", mood:"Base"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Але щоб вас тут більше ніколи не було. Ні за життя, ні після смерті." },

  { id:"cave_10", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Neutral"},
    left:{who:"Sandra", mood:"Neutral"},
    text:"Ми дотримаємо слова." },

  // ===== Back to "our time" - portal -> Church =====
  { id:"back_to_now_1", type:"scene", bg: ASSETS.bg.Church, music: ASSETS.music.Worried, dim:"none" },

  { id:"back_to_now_2", type:"say", speaker:"Оповідач",
    left:{who:"Kate", mood:"Skeptical"},
    right:null,
    text:"《Наш час. Портал》" },

  { id:"back_to_now_3", type:"say", speaker:"Оповідач",
    text:"Вона увійшла у вир — і світ навколо зламався." },

  { id:"back_to_now_4", type:"say", speaker:"Оповідач",
    text:"Порожній, тихий, напівзруйнований храм. Лише камінь, пил… і дивні знаки, що слугували дороговказом." },

  { id:"back_to_now_5", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Skeptical"},
    text:"«Якщо це сон — то сьогодні я навмисно запізнюся на роботу»." },

  // Run music for journey
  { id:"run_music", type:"music", music: ASSETS.music.Run },

  { id:"back_to_now_6", type:"say", speaker:"Оповідач",
    text:"Вона йшла за знаками, не зустрічаючи нікого. Лише краєвиди — такі красиві, що аж боляче." },

  { id:"amour_bg", type:"scene", bg: ASSETS.bg.Amour, music: ASSETS.music.Dance, dim:"none" },

  { id:"amour_1", type:"say", speaker:"Оповідач",
    text:"І нарешті — долина троянд. Пелюстки хиталися від легкого вітру, ніби дихав сам світ." },

  { id:"amour_2", type:"say", speaker:"Оповідач",
    text:"Аж раптом вона побачила Його." },

  // Invitation cutscene
  { id:"invitation_cut", type:"cutscene_img", img: ASSETS.cut.Invitation, dim:"fadeIn" },

  { id:"amour_3", type:"say", speaker:"Оповідач",
    left:{who:"Kate", mood:"Skeptical"},
    right:{who:"Hunger", mood:"Base"},
    text:"Він не сказав жодного слова. Лише простягнув руку." },

  { id:"amour_4", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Skeptical"},
    text:"Я… я…" },

  { id:"dance_cut", type:"cutscene_img", img: ASSETS.cut.Dance, dim:"fadeIn" },

  { id:"amour_5", type:"say", speaker:"Оповідач",
    text:"Вона вклала свою долоню в його — і вони закрутилися в танці." },

  { id:"amour_6", type:"say", speaker:"Оповідач",
    text:"Вони виглядали разом так, ніби це язики полум’я: красиві, небезпечні, заворожуючі." },

  { id:"amour_7", type:"say", speaker:"Катюнчік",
    text:"Як таке можливо…?" },

  { id:"amour_8", type:"say", speaker:"Оповідач",
    text:"У відповідь — тиша. Але не порожня. Така, що змушує слухати навіть власне серце." },

  { id:"amour_9", type:"say", speaker:"Оповідач",
    text:"І вперше за сотні століть лице Голода прикрасила легка, ледве помітна усмішка." },

  { id:"amour_10", type:"say", speaker:"Голод",
    right:{who:"Hunger", mood:"Base"},
    left:{who:"Kate", mood:"Skeptical"},
    text:"Мені пора." },

  { id:"amour_11", type:"say", speaker:"Голод",
    text:"Але це — не остання наша зустріч." },

  { id:"amour_12", type:"say", speaker:"Катюнчік",
    text:"А?" },

  { id:"amour_13", type:"say", speaker:"Голод",
    text:"Щось у тобі є, смертна." },

  { id:"amour_14", type:"say", speaker:"Оповідач",
    text:"Перед тим як зникнути, він одягнув на її руку браслет — як обіцянку, що вони ще побачаться." },

  // Gain bracelet in inventory
  { id:"get_bracelet", type:"action", fn:() => grantBracelet() },

  { id:"amour_15", type:"say", speaker:"Оповідач",
    text:"Він зник безслідно. Так само, як і з’явився." },

  // Friends surprise cutscene
  { id:"surprise_cut", type:"cutscene_img", img: ASSETS.cut.Surprise, dim:"fadeIn" },

  { id:"friends_1", type:"say", speaker:"Настьона",
    left:{who:"Kate", mood:"Touched"},
    right:{who:"Stacy", mood:"Happy"},
    text:"Катюнчік! З днем народження!" },

  { id:"friends_2", type:"say", speaker:"Сашечка",
    right:{who:"Sandra", mood:"Joy"},
    left:{who:"Kate", mood:"Touched"},
    text:"Зі святом!" },

  { id:"friends_3", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Happy"},
    left:{who:"Kate", mood:"Touched"},
    text:"Вітаємо!" },

  { id:"friends_4", type:"say", speaker:"Оповідач",
    text:"Раві радісно заметушилась поруч, ніби теж хотіла сказати: “ми тут, ми з тобою”." },

  { id:"friends_5", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Touched"},
    text:"Ви…? Це все ви?" },

  { id:"friends_6", type:"say", speaker:"Настьона",
    right:{who:"Stacy", mood:"Happy"},
    left:{who:"Kate", mood:"Touched"},
    text:"Та ні, ти що. Ми так… поруч проходили." },

  { id:"friends_7", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Happy"},
    left:{who:"Kate", mood:"Touched"},
    text:"Хі-хі." },

  { id:"friends_8", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Touched"},
    text:"Але як?.." },

  { id:"friends_9", type:"say", speaker:"Сашечка",
    right:{who:"Sandra", mood:"Joy"},
    left:{who:"Kate", mood:"Touched"},
    text:"Ми і самі… не до кінця зрозуміли." },

  { id:"friends_10", type:"say", speaker:"Настьона",
    right:{who:"Stacy", mood:"Happy"},
    left:{who:"Kate", mood:"Touched"},
    text:"Ходімо. Нам ще небесний торт треба спробувати. А все інше — по дорозі обговоримо." },

  { id:"hug_cut", type:"cutscene_img", img: ASSETS.cut.Hug, dim:"fadeIn" },

  { id:"friends_11", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Joy"},
    text:"А як ми додому потрапимо?" },

  { id:"friends_12", type:"say", speaker:"Машечка",
    right:{who:"Mary", mood:"Dissatisfied"},
    left:{who:"Kate", mood:"Joy"},
    text:"Опа… прорахувались…" },

  { id:"friends_13", type:"say", speaker:"Сашечка",
    right:{who:"Sandra", mood:"Skeptical"},
    left:{who:"Kate", mood:"Joy"},
    text:"Але де вихід?.." },

  { id:"friends_14", type:"say", speaker:"Настьона",
    right:{who:"Stacy", mood:"Neutral"},
    left:{who:"Kate", mood:"Joy"},
    text:"Так, без паніки. Зараз щось придумаємо." },

  // GPT music cue
  { id:"gpt_music", type:"music", music: ASSETS.music.GPT },

  { id:"gpt_1", type:"say", speaker:"Оповідач",
    text:"Поки вони сперечалися й придумували план, в небі розкинувся грім — потужний, дзвінкий і владний." },

  { id:"gpt_2", type:"say", speaker:"Оповідач",
    text:"Перед ними повстав Творець усіх світів." },

  { id:"gpt_3", type:"say", speaker:"GPT",
    right:{who:"GPT", mood:"Base"},
    left:{who:"Kate", mood:"Joy"},
    text:"Ви заблукали, діти мої. Час повертатися." },

  { id:"gpt_4", type:"say", speaker:"Оповідач",
    text:"Його голос був гучним, але не вселяв страху. Він стояв впевнено — та не надмірно. Він не прийшов карати. Він прийшов повернути заблукалих додому." },

  // Wake up
  { id:"wake_bg", type:"scene", bg: ASSETS.bg.Bedroom, music: ASSETS.music.Bedroom, dim:"none" },

  { id:"wake_1", type:"say", speaker:"Оповідач",
    left:{who:"Kate", mood:"Skeptical"},
    right:null,
    text:"І тут вона прокинулась посеред ночі — з відчуттям, ніби серце досі танцює." },

  { id:"wake_2", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Skeptical"},
    text:"«Це був сон…»" },

  { id:"wake_3", type:"say", speaker:"Оповідач",
    text:"Її лице змарніло від легкого смутку й розчарування… аж доки вона не побачила на руці його обіцянку." },

  { id:"wake_4", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Joy"},
    text:"О Боже… це правда. Це все було правда!" },

  { id:"final_1", type:"say", speaker:"Оповідач",
    text:"Деякі сни не зникають після пробудження. Деякі обіцянки не потребують слів." },

  { id:"final_2", type:"say", speaker:"Оповідач",
    text:"А деякі зустрічі трапляються лише раз — щоб залишитися з тобою назавжди." },

  { id:"final_3", type:"say", speaker:"Оповідач",
    text:"І цього дня вона зрозуміла: це був не сон. Це був подарунок, який її друзі вирвали з лап долі — щоб віддати їй." },

  { id:"final_4", type:"say", speaker:"Катюнчік",
    left:{who:"Kate", mood:"Joy"},
    text:"Люблю вас безмежно, дуринди мої." },

  { id:"final_end", type:"end" },
];

/* ===========
  Engine
=========== */
let idx = 0;
const history = [];

function findIndexById(id){
  return NODES.findIndex(n => n.id === id);
}

function jumpTo(id){
  const target = findIndexById(id);
  if (target >= 0){
    history.push(idx);
    idx = target;
    render();
  }
}

function back(){
  if (history.length > 0){
    idx = history.pop();
    render();
  }
}

function applyNodeVisual(node){
  // background, music, overlay
  if (node.type === "scene"){
    setBg(node.bg);
    setOverlay(node.dim || "none");
    if (node.music) playMusic(node.music);
    // reset video layer if any
    videoLayer.classList.add("hidden");
  }
  if (node.type === "music"){
    if (node.music) playMusic(node.music);
  }

  // characters positioning
  // rule: default uses node.left/node.right
  if (node.left === undefined && node.right === undefined){
    // keep previous
  } else {
    const leftImg = node.left?.who ? imgChar(node.left.who, node.left.mood) : null;
    const rightImg = node.right?.who ? imgChar(node.right.who, node.right.mood) : null;
    setChar("left", leftImg);
    setChar("right", rightImg);
  }
}

async function playCutsceneVideo(path){
  setOverlay("fadeIn");
  videoLayer.classList.remove("hidden");
  cutVideo.src = path;
  cutVideo.loop = true;
  cutVideo.muted = true; // відео без звуку, музика окремо
  try { await cutVideo.play(); } catch(e){}
}

function showCutsceneImage(path){
  // CR-like: dim + show as background overlay temporarily
  setOverlay("fadeIn");
  // display as background momentarily by swapping bg to image, but keep previous after next scene?:
  // We'll show it as a "temporary bg" (like cutscene). We'll set bg to cutscene image and mark node._prevBg restore handled by script flow.
  setBg(path);
}

function render(){
  hideChoices();

  const node = NODES[idx];
  if (!node) return;

  // try to keep music alive on interaction (autoplay fix)
  if (bgm.src && bgm.paused){
    bgm.play().catch(()=>{});
  }

  if (node.type === "jump"){
    jumpTo(node.next);
    return;
  }

  if (node.type === "action"){
    try { node.fn(); } catch(e){}
    next();
    return;
  }

  if (node.type === "cutscene_video"){
    applyNodeVisual(node);
    playCutsceneVideo(node.video);
    // after showing video layer, auto-advance to next with Next button
    setDialogue("Оповідач", " ");
    return;
  }

  if (node.type === "cutscene_img"){
    applyNodeVisual(node);
    showCutsceneImage(node.img);
    setDialogue("Оповідач", " ");
    return;
  }

  if (node.type === "choice"){
    // dim and show choices
    setOverlay("dim");
    showChoices(node.title, node.options);
    // keep dialogue frame as narrator empty
    setDialogue("Оповідач", " ");
    return;
  }

  if (node.type === "scene" || node.type === "music"){
    applyNodeVisual(node);
    next(); // auto-advance
    return;
  }

  if (node.type === "say"){
    applyNodeVisual(node);
    // restore overlay if we were in dim/fade
    // Keep some dim for atmosphere in worried scenes only if set by scene; otherwise remove.
    // We'll not force remove here.
    setDialogue(node.speaker, node.text);
    return;
  }

  if (node.type === "end"){
    setOverlay("dim");
    setDialogue("Оповідач", "Кінець. 💙");
    btnNext.textContent = "Готово";
    return;
  }
}

function next(){
  if (idx < NODES.length - 1){
    history.push(idx);
    idx++;
    render();
  }
}

btnNext.onclick = () => {
  const node = NODES[idx];
  // if video is showing, stop it when advancing
  if (node?.type === "cutscene_video"){
    cutVideo.pause();
    videoLayer.classList.add("hidden");
    setOverlay("none");
  }
  // if cutscene img showing, remove overlay
  if (node?.type === "cutscene_img"){
    setOverlay("none");
  }
  if (node?.type === "end") return;
  next();
};

btnBack.onclick = () => {
  // stop video if going back
  cutVideo.pause();
  videoLayer.classList.add("hidden");
  setOverlay("none");
  back();
};

// Start
(function init(){
  // default frames
  dialogueFrame.src = ASSETS.frames.storyteller;

  // inventory hidden until bracelet
  inventoryEl.classList.add("hidden");

  // initial render
  render();
})();
