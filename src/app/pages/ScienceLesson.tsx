import { useParams } from 'react-router';
import { LessonTemplate, LessonData } from '../components/LessonTemplate';

const SC = { gradient: '#059669, #10B981', light: '#D1FAE5', text: 'text-emerald-600', bar: 'bg-emerald-500' };

const LESSON_DB: Record<string, LessonData> = {
  plants: {
    title: 'Plants & How They Grow', emoji: '🌱', subject: 'science', topic: 'plants', subjectColor: SC,
    steps: [
      {
        title: 'Parts of a Plant', emoji: '🌿',
        explanation: 'Plants have special parts that each do an important job! Roots, stem, leaves, flowers, and seeds all work together to keep the plant alive and help it make new plants.',
        examples: [
          { text: 'Roots — absorb water and minerals from soil', detail: 'Roots also anchor the plant so wind cannot blow it away!', visual: '🌱' },
          { text: 'Stem — transports water from roots to leaves', detail: 'Like the plant\'s drinking straw and backbone!', visual: '🌿' },
          { text: 'Leaves — make food using sunlight (photosynthesis)', detail: 'Leaves are the plant\'s food factories!', visual: '🍃' },
          { text: 'Flowers — attract insects for pollination', detail: 'Bright colours and sweet nectar attract bees and butterflies!', visual: '🌸' },
          { text: 'Seeds — grow into new plants', detail: 'Every seed is a baby plant waiting to grow!', visual: '🌰' },
          { text: 'Fruit — protects seeds and helps spread them', detail: 'Animals eat fruit and spread the seeds far away!', visual: '🍎' },
        ],
        tip: 'Remember RSLFS: Roots, Stem, Leaves, Flowers, Seeds — and they all work as a team!',
        funFact: 'The largest plant root system ever found stretched over 60 metres underground — that is deeper than a 20-storey building is tall!',
        tryThis: 'Find a plant at home or outside. Can you identify all its parts? Draw it and label each part!',
      },
      {
        title: 'What Plants Need to Grow', emoji: '☀️',
        explanation: 'Plants need FOUR things to survive and grow: sunlight, water, air (carbon dioxide), and nutrients from soil. Remove any one of these and the plant will struggle!',
        examples: [
          { text: 'Sunlight — plants need light to make food', detail: 'Without light, leaves turn yellow and the plant weakens!', visual: '☀️' },
          { text: 'Water — carries nutrients and keeps cells firm', detail: 'Without water, plants wilt and eventually die!', visual: '💧' },
          { text: 'Carbon dioxide (CO₂) — used in photosynthesis', detail: 'Plants breathe in CO₂ and breathe out oxygen!', visual: '💨' },
          { text: 'Minerals from soil — nitrogen, phosphorus, potassium', detail: 'Like vitamins for plants — help them grow strong!', visual: '🌍' },
          { text: 'Warmth — most plants grow best in warm temperatures', detail: 'Frost can kill plants! Some need warmth to flower.', visual: '🌡️' },
          { text: 'Space — roots and leaves need room to spread', detail: 'Overcrowded plants compete and grow slowly!', visual: '📐' },
        ],
        tip: 'Plants make their OWN food using sunlight — they are called "producers" because they produce energy!',
        funFact: 'Cacti can survive for 2 years without water! They store water in their thick stems.',
        tryThis: 'Try a simple experiment: grow two bean seeds — one in sunlight and one in a dark cupboard. Compare them after a week!',
      },
      {
        title: 'Photosynthesis', emoji: '⚡',
        explanation: 'Photosynthesis is the magical process where plants make their own food! Leaves capture sunlight, absorb water from roots, and take in CO₂ from the air to produce glucose (sugar) and oxygen.',
        examples: [
          { text: 'Equation: CO₂ + Water + Sunlight → Glucose + Oxygen', detail: 'Carbon dioxide + water + light = food + oxygen!', visual: '⚡' },
          { text: 'Chlorophyll gives leaves their GREEN colour', detail: 'Chlorophyll is the molecule that captures sunlight!', visual: '🍃' },
          { text: 'Glucose is stored as starch or used for energy', detail: 'Glucose is the plant\'s food — like our bread and pasta!', visual: '🌾' },
          { text: 'Oxygen is released — the air we breathe!', detail: 'Trees and plants produce all the oxygen animals need!', visual: '💨' },
          { text: 'More sunlight = more photosynthesis = faster growth', detail: 'Sunny spots make plants grow faster!', visual: '☀️' },
          { text: 'Leaves have tiny holes (stomata) to let gases in/out', detail: 'Stomata open during the day and close at night!', visual: '🔬' },
        ],
        tip: 'Photo = light. Synthesis = making. Photosynthesis = making food with light! Simple!',
        funFact: 'All the oxygen on Earth comes from photosynthesis by plants and algae. One large tree produces enough oxygen for two people to breathe all year!',
        tryThis: 'Place a leaf in a glass of water in bright sunlight. After a few hours, look for tiny bubbles — those are oxygen!',
      },
      {
        title: 'Life Cycle of a Plant', emoji: '🔄',
        explanation: 'Plants follow a life cycle — from seed to full grown plant and back to seed again! This cycle continues generation after generation.',
        examples: [
          { text: 'Stage 1: Seed — contains a tiny embryo plant inside', detail: 'Seeds can stay dormant (asleep) for years!', visual: '🌰' },
          { text: 'Stage 2: Germination — seed absorbs water and sprouts', detail: 'The seed cracks open and a tiny shoot emerges!', visual: '🌱' },
          { text: 'Stage 3: Seedling — first roots and tiny leaves appear', detail: 'The seedling makes its first food!', visual: '🌿' },
          { text: 'Stage 4: Young plant — grows taller, more leaves form', detail: 'Growing fast, absorbing lots of sunlight!', visual: '🌳' },
          { text: 'Stage 5: Mature plant — flowers bloom, attracts pollinators', detail: 'Insects carry pollen from flower to flower!', visual: '🌸' },
          { text: 'Stage 6: Fruit and seeds — new seeds form and spread', detail: 'The cycle begins again with new seeds!', visual: '🍎' },
        ],
        tip: 'The life cycle is a CIRCLE — it never truly ends! New seeds make new plants, which make new seeds.',
        funFact: 'Scientists found a seed buried in permafrost for 32,000 years in Russia — and it SPROUTED when planted! This seed belonged to an extinct plant species!',
        tryThis: 'Plant a bean seed in a cup of soil. Water it and watch the stages happen over 2-3 weeks. Sketch each stage!',
      },
      {
        title: 'Types of Plants', emoji: '🌳',
        explanation: 'There are hundreds of thousands of plant species! Scientists sort them into groups based on their features: flowering, non-flowering, trees, shrubs, herbs, and more.',
        examples: [
          { text: 'Flowering plants (angiosperms) — produce flowers and fruits', detail: 'Roses, apples, sunflowers — most common plants!', visual: '🌹' },
          { text: 'Non-flowering plants — ferns, mosses, conifers', detail: 'Ferns reproduce using spores, not seeds!', visual: '🌿' },
          { text: 'Trees — woody stem (trunk), can live hundreds of years', detail: 'Oak, pine, mango, banyan trees!', visual: '🌳' },
          { text: 'Shrubs — smaller, many branches from ground level', detail: 'Rose bushes, lavender, jasmine!', visual: '🌿' },
          { text: 'Herbs — small, soft stems, used in cooking and medicine', detail: 'Mint, basil, coriander, aloe vera!', visual: '🌱' },
          { text: 'Aquatic plants — live in or near water', detail: 'Water lilies, lotus, seaweed!', visual: '💧' },
        ],
        tip: 'Scientists have discovered about 400,000 species of plants — and there are still new ones being found every year!',
        funFact: 'The oldest living tree on Earth is "Methuselah" — a bristlecone pine in California that is over 4,800 years old!',
        tryThis: 'Go outside or look in a book. Find 3 different types of plants and identify what group they belong to.',
      },
    ],
  },
  animals: {
    title: 'Animals & Their World', emoji: '🦁', subject: 'science', topic: 'animals', subjectColor: SC,
    steps: [
      {
        title: 'Animal Groups', emoji: '🐾',
        explanation: 'Scientists sort animals into groups based on their features! The main groups are mammals, birds, reptiles, amphibians, fish, and invertebrates. Each group shares key characteristics.',
        examples: [
          { text: 'Mammals — warm-blooded, have fur/hair, feed babies milk', detail: 'Humans, dogs, elephants, whales are all mammals!', visual: '🐘' },
          { text: 'Birds — have feathers, wings, and beaks; lay eggs', detail: 'Eagles, penguins, sparrows — all birds!', visual: '🦅' },
          { text: 'Reptiles — cold-blooded, have scales, mostly lay eggs', detail: 'Snakes, crocodiles, lizards, turtles!', visual: '🐊' },
          { text: 'Amphibians — can live in water AND on land', detail: 'Frogs, toads, salamanders! Born in water, live on land.', visual: '🐸' },
          { text: 'Fish — live in water, breathe through gills, have fins', detail: 'Salmon, clownfish, sharks are all fish!', visual: '🐟' },
          { text: 'Invertebrates — animals WITHOUT a backbone', detail: 'Insects, spiders, worms, jellyfish — 95% of all animals!', visual: '🐛' },
        ],
        tip: 'The key question: Does it have a BACKBONE? Vertebrates (with backbone): mammals, birds, reptiles, amphibians, fish. Invertebrates (without): insects and more!',
        funFact: 'There are over 8 million animal species on Earth — scientists have only named about 1.5 million so far!',
        tryThis: 'Sort these into groups: cat, eagle, frog, goldfish, ant, snake. Which is which?',
      },
      {
        title: 'What Animals Eat — Herbivores, Carnivores, Omnivores', emoji: '🍽️',
        explanation: 'Animals are grouped by what they eat! Plant-eaters are herbivores. Meat-eaters are carnivores. Animals that eat both are omnivores. What an animal eats shapes its whole body!',
        examples: [
          { text: 'Herbivores eat ONLY plants 🌿', detail: 'Cows, rabbits, elephants, horses — they have flat teeth for grinding!', visual: '🐄' },
          { text: 'Carnivores eat ONLY meat 🥩', detail: 'Lions, wolves, sharks — they have sharp teeth for tearing!', visual: '🦁' },
          { text: 'Omnivores eat BOTH plants and meat', detail: 'Bears, humans, foxes, pigs — the most flexible feeders!', visual: '🐻' },
          { text: 'Herbivores have eyes on the sides of their head', detail: 'Wide field of vision to watch for predators!', visual: '🐰' },
          { text: 'Carnivores have eyes at the front for depth perception', detail: 'Perfect for judging distance when hunting!', visual: '🦊' },
          { text: 'Detritivores eat dead material — worms, dung beetles', detail: 'They are nature\'s recyclers and cleaners!', visual: '🪱' },
        ],
        tip: 'Think of the teeth! Flat and wide = herbivore (for grinding plants). Sharp and pointed = carnivore (for tearing meat). Both = omnivore!',
        funFact: 'Giant pandas are classified as carnivores but eat 99% bamboo! Their digestive system is carnivore-like, but they chose plants!',
        tryThis: 'Think of 10 animals. Sort them into herbivore, carnivore, or omnivore. Check your answers online!',
      },
      {
        title: 'Animal Habitats', emoji: '🌍',
        explanation: 'A HABITAT is the natural home of an animal — the environment where it finds food, water, shelter, and mates. Animals are specially adapted to survive in their habitat.',
        examples: [
          { text: 'Rainforest habitat — hot, wet, full of trees', detail: 'Home to monkeys, toucans, jaguars, tropical frogs!', visual: '🌳' },
          { text: 'Desert habitat — hot, dry, sandy or rocky', detail: 'Camels, scorpions, snakes, lizards live here!', visual: '🏜️' },
          { text: 'Ocean habitat — saltwater, vast and deep', detail: 'Whales, sharks, octopus, coral fish!', visual: '🌊' },
          { text: 'Arctic habitat — freezing cold, ice and snow', detail: 'Polar bears, penguins, arctic foxes, seals!', visual: '🧊' },
          { text: 'Grassland/Savanna — warm, few trees, lots of grass', detail: 'Lions, elephants, zebras, giraffes!', visual: '🦒' },
          { text: 'Freshwater habitat — rivers, lakes, ponds', detail: 'Fish, otters, frogs, crocodiles, hippos!', visual: '🏞️' },
        ],
        tip: 'Animals cannot survive if they are moved to the wrong habitat — they are perfectly adapted to their own home!',
        funFact: 'The deep ocean (below 1000m) is one of the least explored places on Earth — scientists discover new species there every year!',
        tryThis: 'Research one animal habitat and list 5 animals that live there. How are each adapted to survive?',
      },
      {
        title: 'Animal Adaptations', emoji: '🔧',
        explanation: 'Animals have special features (adaptations) that help them survive in their habitat. Adaptations can be physical (body parts) or behavioural (things they do).',
        examples: [
          { text: 'Camels have humps that store FAT (not water!) for energy', detail: 'Camels can go 2 weeks without water — they are desert champions!', visual: '🐪' },
          { text: 'Polar bears have hollow fur fibres that trap warm air', detail: 'White fur for camouflage in snow too!', visual: '🐻‍❄️' },
          { text: 'Chameleons change colour to hide from predators', detail: 'Camouflage is a brilliant behavioural adaptation!', visual: '🦎' },
          { text: 'Owls have large eyes and rotate their head 270°', detail: 'Perfect for hunting in the dark!', visual: '🦉' },
          { text: 'Fish have streamlined bodies to move through water easily', detail: 'Reduces drag, like a submarine shape!', visual: '🐟' },
          { text: 'Frogs have webbed feet for swimming and jumping', detail: 'Feet adapted for both water and land!', visual: '🐸' },
        ],
        tip: 'Every body part an animal has usually has a PURPOSE for survival. Ask "why does it have that?" for any animal feature!',
        funFact: 'The Arctic ground squirrel\'s body temperature drops to -3°C during hibernation — below freezing! Any warmer animal would die, but they survive!',
        tryThis: 'Choose one animal and list 3 adaptations it has. Why does each adaptation help it survive?',
      },
    ],
  },
  'human-body': {
    title: 'The Human Body', emoji: '🫀', subject: 'science', topic: 'human-body', subjectColor: SC,
    steps: [
      {
        title: 'Major Body Systems', emoji: '🧬',
        explanation: 'The human body has 11 major organ systems that all work together! Each system has a different job. Let us explore the most important ones.',
        examples: [
          { text: 'Skeletal System — 206 bones support and protect the body', detail: 'Bones also make blood cells in the bone marrow!', visual: '💀' },
          { text: 'Muscular System — over 600 muscles move every part of the body', detail: 'Muscles work in pairs — one pulls, one releases!', visual: '💪' },
          { text: 'Circulatory System — heart pumps blood around the body', detail: 'Blood delivers oxygen and nutrients to every cell!', visual: '🫀' },
          { text: 'Respiratory System — lungs breathe air in and out', detail: 'We breathe in oxygen and breathe out carbon dioxide!', visual: '🫁' },
          { text: 'Digestive System — breaks food into nutrients the body can use', detail: 'Food travels through over 8 metres of intestines!', visual: '🍽️' },
          { text: 'Nervous System — brain and nerves control everything', detail: 'The brain sends signals faster than 270 mph!', visual: '🧠' },
        ],
        tip: 'All 11 systems depend on each other! If one system fails, others are affected too.',
        funFact: 'Your body contains about 37 trillion cells — that is 37,000,000,000,000 cells! Each one is alive and doing a job!',
        tryThis: 'Feel your pulse at your wrist. Count the beats in 30 seconds and double it — that is your heart rate per minute!',
      },
      {
        title: 'The Heart and Circulation', emoji: '❤️',
        explanation: 'The heart is a powerful muscle that pumps blood to every part of the body! Blood carries oxygen, nutrients, and removes waste. This is called the circulatory system.',
        examples: [
          { text: 'The heart beats about 70-100 times per minute when resting', detail: 'That is over 100,000 beats per day!', visual: '❤️' },
          { text: 'Blood travels in arteries (away from heart) and veins (back to heart)', detail: 'Arteries = Away. Veins = Return! Easy to remember!', visual: '🫀' },
          { text: 'Red blood cells carry oxygen from lungs to the body', detail: 'They pick up oxygen in the lungs and deliver it everywhere!', visual: '🔴' },
          { text: 'White blood cells fight germs and diseases', detail: 'Your body\'s army — they attack invaders!', visual: '⚪' },
          { text: 'Plasma is the liquid part of blood — pale yellow', detail: 'Plasma carries nutrients and hormones!', visual: '🩸' },
          { text: 'Your blood would fill about 5 litres if you drained it out!', detail: 'That is about 5 large bottles of water!', visual: '💧' },
        ],
        tip: 'Exercise makes your heart stronger! When you exercise, your heart beats faster to deliver more oxygen to working muscles.',
        funFact: 'If all the blood vessels in a human body were laid end-to-end, they would stretch over 100,000 km — long enough to circle the Earth 2.5 times!',
        tryThis: 'Do 20 jumping jacks, then check your pulse. How much faster is your heart beating than before?',
      },
      {
        title: 'Digestion', emoji: '🍎',
        explanation: 'Digestion breaks food into tiny pieces the body can absorb! It takes about 24-72 hours for food to travel through your entire digestive system.',
        examples: [
          { text: 'Mouth — teeth chew food, saliva starts digestion', detail: 'Saliva contains enzymes that begin breaking down starch!', visual: '😄' },
          { text: 'Oesophagus — muscular tube pushes food to the stomach', detail: 'Muscles squeeze food down — you can even swallow upside down!', visual: '⬇️' },
          { text: 'Stomach — churns food with acid for 2-4 hours', detail: 'Stomach acid is strong enough to dissolve metal!', visual: '🫃' },
          { text: 'Small intestine — absorbs nutrients into the blood', detail: '6-7 metres long — where most digestion happens!', visual: '〰️' },
          { text: 'Large intestine — absorbs water, forms solid waste', detail: 'About 1.5 metres long — compacts waste!', visual: '〰️' },
          { text: 'Waste exits the body — the journey is complete!', detail: 'The whole journey takes 1-3 days!', visual: '♻️' },
        ],
        tip: 'Chew your food well! The more you chew, the easier digestion is — less work for your stomach!',
        funFact: 'Your stomach produces a completely new lining every 3-4 days because the strong acid would dissolve the old one!',
        tryThis: 'After eating a meal, trace the journey of the food through your body. How long will it take to reach each stage?',
      },
      {
        title: 'The Brain and Senses', emoji: '🧠',
        explanation: 'The brain is the control centre of the body! It receives information from 5 senses: sight, hearing, smell, taste, and touch. It processes everything in milliseconds!',
        examples: [
          { text: 'Eyes (sight) — detect light and send images to the brain', detail: 'You actually see upside down and your brain flips it!', visual: '👁️' },
          { text: 'Ears (hearing) — detect sound vibrations', detail: 'Your ear canal is shorter than a centimetre!', visual: '👂' },
          { text: 'Nose (smell) — can detect over 1 trillion different smells', detail: 'Smell is the sense most connected to memory!', visual: '👃' },
          { text: 'Tongue (taste) — has about 10,000 taste buds', detail: 'Sweet, sour, salty, bitter, umami (savoury)!', visual: '👅' },
          { text: 'Skin (touch) — largest sense organ in the body', detail: 'Can feel pressure, pain, heat, cold, and texture!', visual: '✋' },
          { text: 'Brain processes all sensory information simultaneously!', detail: 'The brain works 24/7 — even while you sleep!', visual: '🧠' },
        ],
        tip: 'Your senses protect you — pain warns of danger, smell detects spoiled food, hearing alerts you to sounds around you!',
        funFact: 'Your brain generates about 23 watts of electricity when you are awake — enough to power a small LED light bulb!',
        tryThis: 'Blindfold yourself and try to identify 5 objects using only touch. How many can you identify correctly?',
      },
    ],
  },
  'earth-space': {
    title: 'Earth & Space', emoji: '🌍', subject: 'science', topic: 'earth-space', subjectColor: SC,
    steps: [
      {
        title: 'Our Solar System', emoji: '🌌',
        explanation: 'Our Solar System consists of the Sun, 8 planets, moons, asteroids, and comets. Everything orbits (travels around) the Sun due to its enormous gravity!',
        examples: [
          { text: 'The Sun — a star at the centre of our solar system', detail: 'The Sun is so big that 1.3 million Earths would fit inside it!', visual: '☀️' },
          { text: '8 planets orbit the Sun (in order from closest)', detail: 'Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune!', visual: '🪐' },
          { text: 'Earth is the 3rd planet — the only one with life!', detail: 'Liquid water, the right temperature, and oxygen make Earth special!', visual: '🌍' },
          { text: 'Jupiter is the largest planet — a giant gas ball!', detail: 'Jupiter has no solid surface — it is all gas and liquid!', visual: '🪐' },
          { text: 'Saturn has beautiful rings made of ice and rock', detail: 'Saturn\'s rings stretch 280,000 km wide but are paper-thin!', visual: '💍' },
          { text: 'Moons orbit planets. Earth has 1. Jupiter has 95!', detail: 'Our Moon is the fifth-largest in the solar system!', visual: '🌕' },
        ],
        tip: 'Mnemonic for planets: "My Very Energetic Mother Just Served Us Nachos!" (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune)',
        funFact: 'Light takes 8 minutes to travel from the Sun to Earth. So when you look at the Sun, you are seeing it as it was 8 minutes ago!',
        tryThis: 'Make a model of the solar system! Use a football as the Sun and different sized balls for planets.',
      },
      {
        title: 'Earth\'s Structure', emoji: '🌋',
        explanation: 'Earth is like a hard-boiled egg! It has layers inside: the inner core, outer core, mantle, and crust. We live on the thin outer crust — the "shell" of the Earth.',
        examples: [
          { text: 'Inner Core — solid iron and nickel, incredibly hot (5,400°C)', detail: 'As hot as the surface of the Sun — but solid because of pressure!', visual: '🔴' },
          { text: 'Outer Core — liquid iron and nickel, creates Earth\'s magnetic field', detail: 'The magnetic field protects us from the Sun\'s harmful radiation!', visual: '🟠' },
          { text: 'Mantle — thick rocky layer, partially molten rock (magma)', detail: 'The mantle slowly moves, carrying the plates on top!', visual: '🟡' },
          { text: 'Crust — thin outer layer where we live', detail: 'Oceanic crust (under oceans) and continental crust (land)!', visual: '🟢' },
          { text: 'Tectonic plates float on the mantle and move slowly', detail: 'Plates move about 2-5 cm per year — the speed your nails grow!', visual: '🗺️' },
          { text: 'Where plates meet: earthquakes, volcanoes, mountains form!', detail: 'The Himalayas are still growing from two plates colliding!', visual: '🏔️' },
        ],
        tip: 'Think of Earth as a peach: the skin is the crust, the flesh is the mantle, and the stone is the core!',
        funFact: 'The deepest hole ever drilled on Earth (in Russia) only went 12km — just 0.19% of the way to the centre!',
        tryThis: 'Draw a cross-section of the Earth and label all four layers. Use different colours for each layer!',
      },
      {
        title: 'Day, Night and Seasons', emoji: '🌓',
        explanation: 'Earth rotates (spins) on its axis once every 24 hours — this gives us day and night! Earth also orbits the Sun once every 365.25 days — this gives us a year and seasons!',
        examples: [
          { text: 'Day and Night: Earth spins, facing the Sun = day; facing away = night!', detail: 'The spinning Sun you see moving across the sky is actually YOU spinning!', visual: '🌅' },
          { text: 'Earth is TILTED 23.5° — this causes seasons!', detail: 'Without the tilt, every day would be the same temperature everywhere!', visual: '🔄' },
          { text: 'Summer: your hemisphere is tilted towards the Sun', detail: 'Longer days, higher Sun in sky, more warmth!', visual: '☀️' },
          { text: 'Winter: your hemisphere is tilted away from the Sun', detail: 'Shorter days, lower Sun in sky, less warmth!', visual: '❄️' },
          { text: 'Equinoxes: when day and night are both 12 hours (twice a year)', detail: 'Spring and autumn equinoxes — halfway between extremes!', visual: '⚖️' },
          { text: 'The Moon causes tides with its gravitational pull!', detail: 'Twice a day, the ocean rises and falls due to the Moon!', visual: '🌊' },
        ],
        tip: 'Seasons are NOT caused by distance from the Sun — we are actually CLOSER to the Sun in winter! It is all about the TILT!',
        funFact: 'On Jupiter, a day is only 10 hours long (Jupiter spins very fast!), but a year is 12 Earth years long!',
        tryThis: 'Go outside at noon and evening. Notice how the Sun\'s position has changed. Why does this happen?',
      },
    ],
  },
  weather: {
    title: 'Weather & Climate', emoji: '⛅', subject: 'science', topic: 'weather', subjectColor: SC,
    steps: [
      {
        title: 'Types of Weather', emoji: '🌤️',
        explanation: 'Weather describes the conditions in the atmosphere at a particular time and place! It changes day to day (unlike climate, which is the long-term pattern over 30+ years).',
        examples: [
          { text: 'Sunny ☀️ — the Sun shines strongly, few or no clouds', detail: 'Temperature rises as sunlight warms the ground!', visual: '☀️' },
          { text: 'Cloudy ☁️ — clouds block the Sun, feels cooler', detail: 'Clouds are made of tiny water droplets or ice crystals!', visual: '☁️' },
          { text: 'Rainy 🌧️ — water droplets fall from clouds', detail: 'Rain happens when water droplets in clouds get too heavy!', visual: '🌧️' },
          { text: 'Windy 🌬️ — air moves from high to low pressure areas', detail: 'Wind is caused by differences in air pressure!', visual: '🌬️' },
          { text: 'Snowy ❄️ — frozen water falls in snowflake crystals', detail: 'No two snowflakes are exactly alike — each one is unique!', visual: '❄️' },
          { text: 'Thunder and lightning ⛈️ — electrical storms', detail: 'Lightning is a huge electrical spark between clouds and ground!', visual: '⚡' },
        ],
        tip: 'Weather symbols are used on maps worldwide! ☀️=sunny, ⛅=partly cloudy, 🌧️=rain, ❄️=snow.',
        funFact: 'The highest temperature ever recorded on Earth was 56.7°C in Death Valley, USA (1913). The lowest was -89.2°C in Antarctica (1983)!',
        tryThis: 'Keep a weather diary for 7 days. Record temperature, cloud cover, wind, and rain each day. Look for patterns!',
      },
      {
        title: 'The Water Cycle', emoji: '💧',
        explanation: 'Water constantly moves between the ocean, air, and land in a cycle — evaporation, condensation, and precipitation! The same water has been recycling on Earth for billions of years!',
        examples: [
          { text: 'Evaporation: water heats up and becomes water vapour (gas)', detail: 'The Sun heats oceans, rivers, and puddles — water rises invisibly!', visual: '💨' },
          { text: 'Condensation: water vapour cools and forms clouds', detail: 'As water vapour rises, it cools and becomes tiny liquid droplets!', visual: '☁️' },
          { text: 'Precipitation: water falls as rain, snow, sleet, or hail', detail: 'When droplets in clouds grow too heavy, they fall!', visual: '🌧️' },
          { text: 'Collection: water gathers in rivers, lakes, and oceans', detail: 'Water flows downhill until it reaches a lake, river, or ocean!', visual: '🏞️' },
          { text: 'Transpiration: plants release water vapour through leaves', detail: 'A single tree can release 400 litres of water per day!', visual: '🌿' },
          { text: 'Runoff: water flows over land into streams and rivers', detail: 'After rain, water flows downhill in streams!', visual: '🌊' },
        ],
        tip: 'The water cycle has no beginning or end — it is an endless loop! The water you drink today might have been dinosaur rain!',
        funFact: 'All the water on Earth has been here for about 4 billion years — it just keeps recycling! There is no "new" water.',
        tryThis: 'Make a mini water cycle! Put hot water in a bowl, cover with plastic wrap with ice on top. Watch condensation form underneath!',
      },
      {
        title: 'Climate Zones', emoji: '🌏',
        explanation: 'Different parts of the Earth have different long-term weather patterns — their "climate"! Climate depends on distance from the equator, altitude, and ocean currents.',
        examples: [
          { text: 'Tropical climate — near the equator, hot and wet year-round', detail: 'Rainforests get over 2,000mm of rain per year!', visual: '🌴' },
          { text: 'Desert climate — hot days, cold nights, very dry', detail: 'Less than 250mm of rain per year in a desert!', visual: '🏜️' },
          { text: 'Temperate climate — four distinct seasons (UK!)', detail: 'Mild summers, cool winters, moderate rain!', visual: '🍂' },
          { text: 'Polar climate — cold year-round, ice and snow', detail: 'Antarctica averages -30°C and is the driest continent!', visual: '🧊' },
          { text: 'Mediterranean climate — hot dry summers, warm wet winters', detail: 'Spain, Italy, Greece — great for growing olives!', visual: '🫒' },
          { text: 'Highland climate — gets colder as altitude increases', detail: 'Mount Everest peak is -40°C year-round!', visual: '🏔️' },
        ],
        tip: 'Every 1000 metres you climb in altitude, temperature drops about 6.5°C — that is why mountains have snow at the top!',
        funFact: 'Climate change is causing global temperatures to rise. The last decade (2011-2020) was the warmest on record in human history!',
        tryThis: 'Look at a world map. Find 3 different climate zones and name one country in each.',
      },
    ],
  },
};

function getGenericLesson(topic: string): LessonData {
  const label = topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const emojis = ['🔬', '🧬', '⚗️', '🌿', '🌍', '🦋', '🌡️', '🧪'];
  const visual = emojis[topic.length % emojis.length];
  return {
    title: label, emoji: visual, subject: 'science', topic, subjectColor: SC,
    steps: [
      {
        title: `Introduction to ${label}`, emoji: '🔬',
        explanation: `Welcome to ${label}! Science helps us understand the world around us. Let us investigate this topic together using observation, evidence, and experiments.`,
        examples: [
          { text: `${label} is a fascinating part of science`, detail: 'Every science topic connects to the natural world!', visual },
          { text: 'Scientists observe carefully before drawing conclusions', detail: 'Look closely — details matter in science!', visual: '🔍' },
          { text: 'Evidence is the foundation of science', detail: 'We need proof, not just guesses!', visual: '📊' },
          { text: 'Experiments help us test ideas', detail: 'Change one variable, keep everything else the same!', visual: '🧪' },
          { text: 'Science builds on what came before', detail: 'Each discovery leads to new questions!', visual: '📚' },
          { text: 'Science affects our daily lives in countless ways', detail: 'Medicine, technology, food — all come from science!', visual: '🌍' },
        ],
        tip: 'The scientific method: Observe → Question → Hypothesis → Experiment → Conclude!',
        funFact: 'Scientists estimate there are between 8 and 8.7 million species of life on Earth, but we have only named about 1.5 million!',
        tryThis: `Before this lesson, write one question you have about ${label}. Look for the answer as you learn!`,
      },
      {
        title: 'Key Scientific Concepts', emoji: '🧬',
        explanation: 'Science uses special vocabulary and key ideas. Understanding these core concepts helps you think like a scientist!',
        examples: [
          { text: 'Observe: use your senses to gather information', detail: 'Seeing, hearing, smelling, touching, tasting (carefully)!', visual: '👁️' },
          { text: 'Hypothesis: an educated guess that can be tested', detail: '"I think X will happen because..." — always testable!', visual: '💭' },
          { text: 'Variable: something that changes in an experiment', detail: 'Change one variable at a time for a fair test!', visual: '📊' },
          { text: 'Evidence: information gathered from observations', detail: 'Data, measurements, and observations = evidence!', visual: '🔍' },
          { text: 'Conclusion: what the evidence tells us', detail: 'Based on evidence, NOT on what we hoped for!', visual: '✅' },
          { text: 'Theory: a well-tested explanation supported by evidence', detail: 'Not a "guess" — a scientific theory is very well evidenced!', visual: '🏆' },
        ],
        tip: 'A "fair test" in science means you only change ONE thing at a time. Everything else stays the same!',
        funFact: 'The word "science" comes from the Latin "scientia" meaning "knowledge" — scientists are knowledge seekers!',
        tryThis: 'Design a simple experiment for a question you have. What would you change? What would you measure?',
      },
      {
        title: 'Science in the Real World', emoji: '🌍',
        explanation: 'Science is not just in the classroom — it shapes everything around us! Technology, medicine, food, transport — all developed through scientific discovery.',
        examples: [
          { text: 'Medicine — vaccines, antibiotics, surgery all come from science', detail: 'Vaccines have saved hundreds of millions of lives!', visual: '💊' },
          { text: 'Technology — computers, phones, internet from physics/engineering', detail: 'Your phone has more computing power than the first Moon rocket!', visual: '📱' },
          { text: 'Agriculture — modern farming uses science to grow more food', detail: 'Scientists developed seeds that resist disease and drought!', visual: '🌾' },
          { text: 'Climate science — understanding how human activity affects Earth', detail: 'Science helps us understand and address climate change!', visual: '🌡️' },
          { text: 'Space exploration — rockets and satellites from physics', detail: 'GPS in your phone uses satellites and Einstein\'s theory of relativity!', visual: '🚀' },
          { text: 'Environmental science — protecting nature using scientific knowledge', detail: 'Science helps us clean water, air, and protect endangered species!', visual: '🌿' },
        ],
        tip: 'Every piece of technology you use was invented because someone applied scientific knowledge creatively!',
        funFact: 'The Internet was invented by scientist Tim Berners-Lee in 1989 — he gave it to the world for FREE!',
        tryThis: 'Look around your room. Name 5 things that were invented using science. How did science help create each one?',
      },
    ],
  };
}

export function ScienceLesson() {
  const { topic = 'plants' } = useParams<{ topic: string }>();
  const lesson = LESSON_DB[topic] ?? getGenericLesson(topic);
  return <LessonTemplate data={lesson} />;
}
