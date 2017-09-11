require "active_support/time"
require "dato"
require "pp"

@categories = ["Architektur", "Kommunikationsdesign", "Produktdesign", "Studio", "Team", "Other"]

@titles = [ "The Bureaucracies of Sustainability: John Waters and Dysfunction",
            "To Find the Properties of Banality: Constructing a Praxis of Damage",
            "Arbitrary Charm? Constructing a Praxis of Dysfunction",
            "Breaking Dilettantes: Constructing a Praxis of Urban Experience",
            "Romancing Rubbish: A Retrospective of Aesthetic Forms and Their Opposites",
            "The Politics of Charm: A Remix of Interactivity",
            "Mediating Chemistry? Queers and Change",
            "Remixing Dilettantes: A Retrospective of the Local",
            "Arbitrary Sustainability: Post-Painterly Art of the Status Quo",
            "Collective Properties: Defying Dysfunction",
            "Fantastic Chemistry: Cheating Misfortune",
            "To Find the Properties of Gaming: A Remix of Damage",
            "Fantastic Illusion: Achieving and Undermining Remediation",
            "After the History: Defying the Avant Garde",
            "Mediating Chemistry: Media Art and the Status Quo",
            "Arbitrary Properties: The Politics of Dysfunction",
            "To Find the Properties of Rubbish: Figuring Social Practice",
            "The Bureaucracies of Sustainability: Constructing a Praxis of Juncture",
            "Extravagant Rubbish: Figuring the Status Quo",
            "Extravagant History: The Politics of Progress"]

@descriptions = [ "Nun Léift blénken no, am heemlech d'Stroos gin. Da stét gesiess d'Margréitchen gin, vill derbei op dén. Mat mä päift gewalteg schéinen, no esou Gaas bei. Räich eraus séngt et ass, un ston zënter d'Land nun, an Benn rëscht net.",
                  "Frot erem op rëm. Hir Hunn stét Feierwon do. Mir an drun iw'rem Blieder, gehéiert hannendrun de nei. Ass Räis kille heemlech da, drun derbei Hemecht nët hu.",
                  "Bessert erwaacht d'Margréitchen op dat, nei Well blénken gemaacht ké, nët jo Léift Freiesch d'Meereische. Ze den Lann dämpen laanscht, schléit beschéngt all si, do grousse nozegon Freiesch wär. Zum d'Mier d'Gaassen de. Benn sëtzen d'Kirmes um sin, bei Wand uechter d'Margréitchen am. Land ruffen Stieren et rei, un vun Halm iwer Fläiß.",
                  "Feld d'Musek da hun, wa méi eise Bass d'Welt, mä fir Dauschen d'Vioule. Hunn keen jeitzt da oft. Ke soubal iw'rem gefällt hun. Da lait bleiwe grousse wéi, da frou schéinen rei. An dee Heck laanscht, fu dee räich grouss d'Kàchen, jéngt d'Margréitchen gét fu.",
                  "Hale rëschten d'Liewen ech do, do Gaas rëscht sou. Si dee genuch schléit d'Kàchen. Ons dann d'Pied en, un aus d'Mier d'Meereische. Hirem kommen Fletschen och fu, net de soubal d'Gaassen, rei fu Ierd Ronn d'Vullen. An main d'Mier rei.",
                  "Gin as stét Fletschen, dann beschte d'Kamäiner un wee. Sin wait fest jo. Stét drun schnéiwäiss wee an. Am Grénge prächteg Fletschen mir. Gëtt Dohannen fir en. Lossen gefällt no dén, rëm en fort ruffen Dauschen.",
                  "Bléit Fuesent eng jo, iech Stad d'Musek mä gei, ze mir Wisen zënne Säiten. Ston räich zënter mir no, Engel rëschten ke ech. Stét Hären lossen dat dé. Un nët dann bessert, as Riesen Fuesent Dauschen mir. Mier jéngt méngem fir ke.",
                  "Himmel Feierwon jo déi. Wat ke séngt gesiess d'Kirmes. Ke bei ruffen rëscht blénken, wa gei päift blëtzen prächteg. Hin Hunn koum as, Land zwëschen d'Kirmes zum ke. Mamm blénken déi as, fu dee gutt grouss Nuechtegall.",
                  "De nei jéngt séngt, grouss uechter vu blo, et aus Welt brét Kaffi. Fond Mecht wa dee. Hun wuel brét d'Wéën hu. Ké all d'Welt d'Beem beschte, Bänk Stréi d'Loft déi en. Hunn Zalot rem dé, un Ronn Fletschen mat.",
                  "Zënne geplot blénken och wa, wielen bereet d'Kàchen hu hie. Vill d'Bëscher méi en, zwé ston Ronn ze. Ston jéngt soubal dén ké. En dem Welt Gaas. Sech d'Musek d'Liewen vun an, gei dann d'Welt am, dé gét stét iweral gefällt. Méi as Engel Schied, huet Engel no och.",
                  "De bléit d'wäiss blénken bei, de ass Land Kaffi d'Gaassen, zum botze d'Loft duurch fu. Wéi engem Blummen jo, wéi as kréien Minutt Blieder. Eng Léift d'Hierz op, ké wee d'Wéën ruffen Keppchen. Bass d'Pan bessert en méi, schaddreg d'Gaassen et sou. Oft gebotzt Dauschen ke, vu méi vill Fläiß soubal. Frësch Kléder nei jo. No blo gebotzt d'Stroos beschéngt, sinn gréng hannendrun en vun.",
                  "Gét dé Grénge Fletschen Hämmelsbrot, Ierd schléit laanscht am och, Dach spilt gebotzt hir no. Bléit duerch dat wa, sin mä hinnen d'Kamäiner. Hu Mamm laacht Dauschen dem. Rei Noper goung laanscht um, déi en Léift bleiwe derfir, jeitzt d'Meereische ons hu. Koum Klarinett hu wat, ech d'Pan Gaart de.",
                  "Rëm et keen d'Mier. Wa ass Ierd soubal Blummen, wéi un Halm kréien derbei. Sinn drem wee si. Riesen duerch d'Hierz fu aus, rëm stolz spilt bessert un, wa frësch d'Liewen bei. Net frou wielen Friemd no, rëm ze Faarwen d'Vullen Kolrettchen, dan as Ierd d'Mier.",
                  "Fu méi Mamm genuch gebotzt, hun ke frou Keppchen. Am Eisen bereet nun, dé wee rifft heescht Schuebersonndeg, fir päift Himmel un. Ruffen iw'rem schaddreg hie fu, um nei Kaffi virun. Do päift genuch d'Vioule och, vu gét ugedon rëschten. Bleiwe rëscht grouss wéi si, rou hu Dach d'Beem, de Welt d'Vullen eng.",
                  "Da Scholl d'Beem Hemecht wee, wéi keng bléit Kirmesdag si, vu päift Säiten iw'rem dat. Da ma'n d'Kanner hun, un dan haut riede Feierwon, wäit Mier kommen no wéi. Wa fest kommen d'Kàchen blo, fu nun duurch iw'rem, wéi ugedon rëschten d'Lëtzebuerger am. Dé rëscht Grénge klinzecht ons, an gei dann Margréitchen. No iwer eise nozegon nët, kille gewëss jo eng, iwer stolz wielen ass wa. Jo fir Engel Blummen, mat geet verstoppen fu, dé rou Monn hinnen.",
                  "Ke ma'n jéngt virun nei. Heck ston genuch méi mä, gréng wellen no déi. Dir gudden néierens da. Koum gesiess et rou. Un schléit hannendrun hin, vu päift d'Margréitchen rëm. Haut sinn lait gei et.",
                  "Welt Eisen an hir. Wou ze séngt Faarwen, si all gutt eraus botze, iwer ruffen d'wäiss vu vun. Hunn Bänk Dach an rou. Schlon gebotzt d'Vioule um vun. D'Beem gudden wat fu, ons ké spilt séngt.",
                  "Wat vu Fielse Schuebersonndeg, rou wuel wäit as. Ke Eisen Fuesent gesiess dee, as nei huet Mier Blummen. Durch ruffen duurch ke den, jo wat alle Kaffi Hierz. Fir hale wellen ke. As riede d'Kàchen aus, lossen Keppchen dan jo.",
                  "Dan de ugedon muerges Margréitchen, vu oft Fläiß dämpen. Méi um meescht gewalteg, Dach beschte no dén. Hu Dach geplot Margréitchen wou. Dee vill Noper zënne un, op ston erem fir, Eisen brommt Gesträich dé get."]

@images = [
  [ "http://68.media.tumblr.com/78983f89cc03616037e8b70c100494f2/tumblr_ovoa3r7q5y1qz6f9yo7_1280.jpg",
    "http://68.media.tumblr.com/48e9cdadc772bc7afe3fbb68d540b164/tumblr_ovoa3r7q5y1qz6f9yo1_1280.jpg",
    "http://68.media.tumblr.com/72eed1ef84778f5a3f534617927271d5/tumblr_ovoa3r7q5y1qz6f9yo5_1280.jpg" ],

  [ "http://68.media.tumblr.com/a3847ac14838b3909577c0d402ab7942/tumblr_ovntlwi0Fm1qz6f9yo1_1280.jpg",
    "http://68.media.tumblr.com/4d1266888c2f6b3ac30d4f12580061ff/tumblr_ovntlwi0Fm1qz6f9yo3_1280.jpg",
    "http://68.media.tumblr.com/f276593ed9cbe7123ac2af6de18a359f/tumblr_ovntlwi0Fm1qz6f9yo2_1280.jpg" ],
  
  [ "https://scontent-vie1-1.cdninstagram.com/t51.2885-15/e35/20688552_177938639415795_7303715092279853056_n.jpg"] ,
  
  [ "http://68.media.tumblr.com/d36a9999ccb89ebece590093fde31bcb/tumblr_ovlk5kdvgK1qz6f9yo2_500.jpg",
    "http://68.media.tumblr.com/2d45de16e32299d5e9a73dbc60e070c4/tumblr_ovlk5kdvgK1qz6f9yo6_1280.jpg",
    "http://68.media.tumblr.com/382d5b9d1e1bb44eb01c12583f4483f2/tumblr_ovlk5kdvgK1qz6f9yo1_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/00b0210facf5873f7dc456f1ae27aef0/tumblr_ovkkm7Dirm1qz6f9yo4_r1_1280.jpg",
    "http://68.media.tumblr.com/be5c6f5ebbc774abb1eff846da3ee01d/tumblr_ovkkm7Dirm1qz6f9yo1_1280.jpg",
    "http://68.media.tumblr.com/5b826bf9b6f2ca6b5b3734ec1b8fb613/tumblr_ovkkm7Dirm1qz6f9yo2_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/44f7cbc756d51e1209438c2438d5dd07/tumblr_ovh0eca7Mp1qz6f9yo2_1280.jpg",
    "http://68.media.tumblr.com/c92a8a73fa7e4181a03a47f1000bd522/tumblr_ovh0eca7Mp1qz6f9yo4_1280.jpg",
    "http://68.media.tumblr.com/79d24c328f0b6f928885fb28c7b87729/tumblr_ovh0eca7Mp1qz6f9yo1_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/ce0e18623226108c5b2917f620ff807f/tumblr_ovgtmqWywC1qz6f9yo5_1280.jpg",
    "http://68.media.tumblr.com/986c1551d5ff0d9c13b47be7cf3127ef/tumblr_ovgtmqWywC1qz6f9yo3_1280.jpg",
    "http://68.media.tumblr.com/36b2076528aa855b523e564026a322b5/tumblr_ovgtmqWywC1qz6f9yo2_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/753e45a049234ce20e989d61dbf2818b/tumblr_ovf0rvif5y1qz6f9yo2_1280.jpg",
    "http://68.media.tumblr.com/1bb205916a32f3cefad075a9ce98f496/tumblr_ovf0rvif5y1qz6f9yo1_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/f7a26f80536f765372fe1ea8478def37/tumblr_ovexmcu2Ao1qz6f9yo1_1280.jpg",
    "http://68.media.tumblr.com/ad6e12c5399e6133db2e7daf59a17bfd/tumblr_ovexmcu2Ao1qz6f9yo3_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/4e9613f5729283896fe06b97f25bf37b/tumblr_ovq6vthuIh1qz6f9yo3_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/e43119317df2dbcad095864988f45d32/tumblr_oven0eKUkU1qz6f9yo5_1280.jpg",
    "http://68.media.tumblr.com/14b397fcf3a3c3841ed407954127d4ff/tumblr_oven0eKUkU1qz6f9yo6_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/89e673cfc30ee5819fee9343cf9f6aa5/tumblr_ovem2oWaXT1qz6f9yo5_1280.jpg",
    "http://68.media.tumblr.com/bb8225d3887b1c046ec35e29a2649966/tumblr_ovem2oWaXT1qz6f9yo1_1280.jpg",
    "http://68.media.tumblr.com/a59ef0ebb0489a38617eb599eb4b807c/tumblr_ovem2oWaXT1qz6f9yo6_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/ab51988ebb0ca0acc82e4618f8d8904e/tumblr_ovecwqPS811qz6f9yo5_r1_1280.jpg",
    "http://68.media.tumblr.com/b538ce99d400c9fb76ed03766242eb0d/tumblr_ovecwqPS811qz6f9yo4_r1_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/1ad18c9beb3496da5a382a6ab6bea499/tumblr_ovd4yvTwuC1qz6f9yo3_1280.jpg",
    "http://68.media.tumblr.com/9c834796dc87113830a7666f4254a870/tumblr_ovd4yvTwuC1qz6f9yo1_1280.jpg" ],
  
  [ "https://scontent-vie1-1.cdninstagram.com/t51.2885-15/e35/10005373_122087728446421_4087985456136847360_n.jpg" ],
  
  [ "http://68.media.tumblr.com/4fd84c8d74f21eb57decfa6230158116/tumblr_ov8i7qhSNj1qz6f9yo4_1280.jpg",
    "http://68.media.tumblr.com/c8221dedbd94d505a812ed244f7357f3/tumblr_ov8i7qhSNj1qz6f9yo6_1280.jpg",
    "http://68.media.tumblr.com/5c5f758880669505480acaeea90d4d06/tumblr_ov8i7qhSNj1qz6f9yo2_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/4cdc3d9e711cc66b50bdce2fe02a06dd/tumblr_ov4ptapE2S1qz6f9yo3_1280.jpg",
    "http://68.media.tumblr.com/8f8b1fd652ccb0f18dac1ca34b976aa1/tumblr_ov4ptapE2S1qz6f9yo4_1280.jpg",
    "http://68.media.tumblr.com/8758f48bfc5ed7b07612a7ad90a55081/tumblr_ov4ptapE2S1qz6f9yo6_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/f2325ccc400611d027d3ea437a9c6638/tumblr_ov25uhnQhA1qz6f9yo1_1280.jpg",
    "http://68.media.tumblr.com/a74d31a579769d85f8241fac4f91b36a/tumblr_ov25uhnQhA1qz6f9yo3_1280.jpg" ],
  
  [ "http://68.media.tumblr.com/61a62781fa24c3e7a48e32cd4fc5b292/tumblr_ouu37tr6HZ1qz6f9yo2_540.jpg",
    "http://68.media.tumblr.com/a0836e85dfe2f916a5bb2ed6397287ac/tumblr_ouu37tr6HZ1qz6f9yo4_540.jpg" ],
  
  [ "http://68.media.tumblr.com/1f509520e4b93ecf0be5ba9ccf7c0b42/tumblr_ousc33Pv5A1qz6f9yo4_1280.jpg",
    "http://68.media.tumblr.com/94c1924f62cdba51af32fb008c73a13c/tumblr_ousc33Pv5A1qz6f9yo2_1280.jpg" ]
]

@locations = [["New York", { :latitude => 40.6974881, :longitude => -73.979681 }],
              ["Lagos", { :latitude => 6.548679, :longitude => 3.1166239 }],
              ["Sao Paolo", { :latitude => -23.6815303, :longitude => -46.8761707 }],
              ["Teheran", { :latitude => 35.6970456, :longitude => -51.0689483 }],
              ["Samoa", { :latitude => -13.8598265, :longitude => -171.8032602 }],
              ["Zanzibar", { :latitude =>-6.1669578, :longitude => 39.1554589 }],
              ["Johannesburg", { :latitude =>-26.1713504, :longitude => 27.969813 }],
              ["Reykjavík", { :latitude =>64.1335726, :longitude => -21.992866 }],
              ["Leh", { :latitude =>34.1663277, :longitude => 77.5316329 }],
            ]



def sluggify text
  text.gsub(/[\:\?]/, '')
      .gsub(/[\s]/, '-')
      .downcase
end

def make_gallery index
  images =
  images.map { |i| { "path" => i }}
end

def time_rand from = 0.0, to = Time.now
  Time.at(from + rand * (to.to_f - from.to_f))
    .strftime("%Y-%m-%d")
end

def make_entry(index, client)
  title       = @titles[index]
  slug        = sluggify title
  category    = @categories.sample
  description = @descriptions[index]
  date        = time_rand(2.years.ago, Time.now)
  location    = @locations.sample


  pp "title #{title}"
  pp "slug #{slug}"
  pp "category #{category}"
  pp "description #{description}"
  pp "date #{date}"
  pp "location #{location}"
  pp "————————————————"

  gallery =  @images[index].map { |url| 
    image = Dato::Upload::Image.new(client, url)
    image.upload 
  }

  # create a new Article record
  entry = client.items.create(
            item_type:    "14005",
            title:        title,
            slug:         slug,
            gallery:      gallery,
            description:  description,
            date:         date,
            category:     category,
            location:     location[0],
            latlng:       location[1])

  pp "entry: #{entry}"
  
end

# create a DatoCMS client
client = Dato::Site::Client.new("94278702bff475b3973f31f0ed39d0")


(0..19).each do |i|
  make_entry i, client
end

# pp client.items.all

# # create a new Article record
# pp client.items.create(
#   item_type:    "14005",
#   title:        "Foo Bar",
#   slug:         "foo-bar",
#   gallery:      [{ "alt"=>nil,
#                    "path"=>
#                     "/3197/1504124125-135_gewerbe_graber_werkhaus_nord8_chiemsee_rendering_visualisation_exterior.jpeg",
#                    "size"=>110377,
#                    "title"=>nil,
#                    "width"=>970,
#                    "format"=>"jpeg",
#                    "height"=>545},
#                   {"alt"=>nil,
#                    "path"=>
#                     "/3197/1504124062-135_gewerbe_graber_werkhaus_nord8_chiemsee_axonometry_scheme_distribution.jpeg",
#                    "size"=>31699,
#                    "title"=>nil,
#                    "width"=>970,
#                    "format"=>"jpeg",
#                    "height"=>545}],
#   description:    "Ein Würfel sprach zu sich: Ich bin
#                    mir selbst nicht völlig zum Gewinn!
                    
#                    Denn meines Wesens sechste Seite,
#                    und sei es auch ein Auge bloß,
#                    sieht immerdar, statt in die Weite,
#                    der Erde ewig dunklen Schoß.
                    
#                    Als dies die Erde, drauf er ruhte,
#                    vernommen, ward ihr schlimm zumute.
                    
#                    Du Esel, sprach sie, ich bin dunkel,
#                    weil dein Gesäß mich just bedeckt!
#                    Ich bin so licht wie ein Karfunkel,
#                    sobald du dich hinweggefleckt.
                   
#                   Der Würfel, innerlichst beleidigt,
#                   hat sich nicht weiter drauf verteidigt.",

#   date:           "2012-02-01",
#   category:       "Architektur",
#   location:       "Wien",
#   latlng:         { :latitude => 48.1298707, :longitude => 11.58345220000001 }
# )

