const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const { Recipe } = require('./models/Recipe');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder]: Clearing old database records...');
    await Recipe.deleteMany({});
    await User.deleteMany({});

    console.log('[Seeder]: Creating demo chefs and users...');
    const demoPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(demoPassword, salt);

    const users = await User.insertMany([
      {
        name: 'Chef Tejaswini',
        email: 'tejaswini@recipehub.com',
        password: hashedPassword
      },
      {
        name: 'Marco Rossi',
        email: 'marco@recipehub.com',
        password: hashedPassword
      },
      {
        name: 'Priya Sharma',
        email: 'priya@recipehub.com',
        password: hashedPassword
      },
      {
        name: 'Mei Ling',
        email: 'meiling@recipehub.com',
        password: hashedPassword
      }
    ]);

    const [tejaswini, marco, priya, mei] = users;

    console.log('[Seeder]: Populating recipes across all categories...');

    const sampleRecipes = [
      {
        title: 'Creamy Butter Chicken (Murgh Makhani)',
        description:
          'A rich, velvety North Indian classic featuring tender marinated chicken tikka simmered in a luscious tomato, cashew, butter, and fenugreek gravy.',
        category: 'Indian',
        prepTime: 25,
        cookTime: 35,
        servings: 4,
        image:
          'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=1200&q=80',
        author: tejaswini._id,
        ingredients: [
          '800g boneless chicken thigh, cut into bite-sized cubes',
          '1 cup fresh plain yogurt (curd)',
          '2 tbsp ginger-garlic paste',
          '1 tbsp Kashmiri red chili powder',
          '1 tsp garam masala powder',
          '4 ripe Roma tomatoes, pureed',
          '15-20 whole cashews, soaked & ground into fine paste',
          '4 tbsp unsalted butter',
          '1/2 cup fresh heavy cream',
          '1 tbsp dried kasuri methi (fenugreek leaves)',
          'Salt to taste and 1 tsp sugar'
        ],
        steps: [
          'In a large bowl, marinate chicken cubes with yogurt, 1 tbsp ginger-garlic paste, chili powder, and salt for at least 1 hour.',
          'Heat a grill pan or cast iron skillet with a little butter and sear the marinated chicken pieces until charred around the edges. Set aside.',
          'In a heavy-bottomed pot, melt 2 tbsp butter. Add remaining ginger-garlic paste and sauté for 1 minute until fragrant.',
          'Pour in tomato puree and simmer on medium heat for 12-15 minutes until oil starts separating from the sauce.',
          'Whisk in the smooth cashew paste, remaining chili powder, garam masala, and 1/2 cup warm water. Simmer gently.',
          'Add the seared chicken pieces and simmer together for 8-10 minutes on low heat.',
          'Finish by stirring in heavy cream, remaining butter, crushed kasuri methi, and a pinch of sugar. Serve steaming hot with garlic butter naan.'
        ]
      },
      {
        title: 'Classic Italian Margherita Pizza with Fresh Basil',
        description:
          'Neapolitan style artisanal pizza crafted with a slow-fermented crust, San Marzano tomato sauce, fresh buffalo mozzarella, and fragrant garden basil leaves.',
        category: 'Italian',
        prepTime: 20,
        cookTime: 12,
        servings: 2,
        image:
          'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1200&q=80',
        author: marco._id,
        ingredients: [
          '250g homemade pizza dough ball (room temperature)',
          '1/2 cup San Marzano canned whole tomatoes, hand crushed',
          '150g fresh buffalo mozzarella, drained and torn',
          '10-12 fresh basil leaves',
          '2 tbsp extra virgin olive oil',
          '1/2 tsp sea salt',
          'Semolina flour for dusting the pizza peel'
        ],
        steps: [
          'Preheat oven with a pizza baking stone or heavy steel at 250°C (480°F) for at least 45 minutes.',
          'Gently stretch the dough by hand on a semolina-dusted counter, leaving a puffy 1-inch raised outer rim (cornicione).',
          'Ladle crushed tomato sauce onto center and swirl outward in a thin, even circle leaving the crust border clear.',
          'Distribute torn pieces of fresh buffalo mozzarella evenly across the tomato layer.',
          'Slide onto the scorching hot pizza stone and bake for 8-10 minutes until crust is blistered and cheese is bubbling.',
          'Remove immediately, scatter fresh sweet basil leaves, and finish with a drizzle of robust Italian olive oil.'
        ]
      },
      {
        title: 'Authentic Sichuan Kung Pao Chicken',
        description:
          'A firecracker stir-fry bursting with wok hei, tender diced chicken, toasted crunchy peanuts, fiery dried red chilies, and tingling Sichuan peppercorns.',
        category: 'Chinese',
        prepTime: 20,
        cookTime: 10,
        servings: 3,
        image:
          'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=1200&q=80',
        author: mei._id,
        ingredients: [
          '500g skinless chicken breast, cut into 1/2-inch cubes',
          '1 tbsp Shaoxing cooking wine',
          '2 tbsp light soy sauce & 1 tsp dark soy sauce',
          '1 tbsp cornstarch',
          '15 whole dried Sichuan red chilies, snipped into halves',
          '1 tsp whole Sichuan peppercorns',
          '1/2 cup roasted unsalted peanuts',
          '3 stalks scallions, sliced into rounds',
          '3 cloves garlic and 1 inch fresh ginger, finely minced',
          'Sauce: 1.5 tbsp Chinkiang black vinegar, 1 tbsp sugar, 1 tsp sesame oil, 1 tsp cornstarch mixed in 3 tbsp water'
        ],
        steps: [
          'Toss chicken cubes with Shaoxing wine, 1 tbsp soy sauce, and 1 tbsp cornstarch. Let rest for 15 minutes.',
          'Whisk all Kung Pao sauce ingredients in a small bowl until sugar and cornstarch dissolve completely.',
          'Heat 2 tbsp oil in a smoking hot wok. Add dried chilies and Sichuan peppercorns, stir-frying for 30 seconds until aromatic.',
          'Add marinated chicken cubes into the wok and sear undisturbed for 1 minute, then stir-fry vigorously until opaque.',
          'Push chicken to the sides, add minced garlic, ginger, and scallion whites to the center and stir-fry for 30 seconds.',
          'Pour in the sauce mixture and stir constantly as it thickens into a glossy glaze coating the chicken.',
          'Toss in crunchy roasted peanuts and scallion greens. Toss vigorously and transfer immediately to a serving platter.'
        ]
      },
      {
        title: 'Decadent Dark Chocolate Molten Lava Cake',
        description:
          'Intensely rich individual chocolate cakes with firm, delicate edges and an irresistible, warm molten chocolate center that flows luxuriously at first spoonful.',
        category: 'Desserts',
        prepTime: 15,
        cookTime: 12,
        servings: 4,
        image:
          'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
        author: tejaswini._id,
        ingredients: [
          '200g premium 70% dark chocolate, chopped',
          '100g unsalted butter, plus extra for ramekins',
          '2 large whole eggs + 2 large egg yolks (room temperature)',
          '1/3 cup granulated sugar',
          '2 tbsp all-purpose flour',
          '1 tsp pure vanilla extract',
          'Pinch of fine sea salt',
          'Unsweetened cocoa powder for dusting',
          'Vanilla bean ice cream & fresh raspberries for serving'
        ],
        steps: [
          'Preheat oven to 210°C (410°F). Butter four 6-ounce ceramic ramekins and dust inside generously with cocoa powder.',
          'Melt dark chocolate and butter together in a heatproof glass bowl set over simmering water, stirring until silky smooth.',
          'In a separate bowl, whisk whole eggs, yolks, sugar, vanilla, and salt until pale and thickened.',
          'Gently fold the melted chocolate mixture into the egg mixture until fully combined.',
          'Fold in sifted flour gently using a spatula until no dry streaks remain.',
          'Divide batter evenly among prepared ramekins and bake for exactly 11-12 minutes until sides are firm but center is soft and jiggly.',
          'Let rest for 1 minute, run a thin butter knife along edges, invert onto dessert plates, and dust with powdered sugar.'
        ]
      },
      {
        title: 'Golden Masala Dosa with Coconut Chutney & Sambar',
        description:
          'Crispy fermented crepe made from rice and black lentils, stuffed with spiced mustard-seed mashed potatoes, paired with freshly grated coconut chutney.',
        category: 'Breakfast',
        prepTime: 15,
        cookTime: 20,
        servings: 3,
        image:
          'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=1200&q=80',
        author: priya._id,
        ingredients: [
          '3 cups fermented dosa batter',
          '4 medium potatoes, boiled, peeled, and gently mashed',
          '1 large onion, thinly sliced',
          '2 green chilies, finely slit',
          '1 tsp black mustard seeds',
          '1 tsp split urad dal & chana dal',
          '1 sprig fresh curry leaves',
          '1/2 tsp turmeric powder',
          'Fresh coriander leaves, chopped',
          'Ghee or cold-pressed sesame oil for roasting'
        ],
        steps: [
          'Heat oil in a pan. Temper with mustard seeds, urad dal, chana dal, and fresh curry leaves until fragrant.',
          'Add sliced onions and green chilies. Sauté until translucent, then add turmeric and salt.',
          'Stir in mashed potatoes with 1/4 cup warm water to create a moist, spreadable masala. Simmer 3 minutes and garnish with coriander.',
          'Heat a cast-iron tawa on high heat, sprinkle with water to cool slightly, and wipe with a cloth.',
          'Pour a ladle of dosa batter in the center and swiftly spread outwards in concentric circles into a thin crepe.',
          'Drizzle ghee generously around the edges and cook on medium-high heat until golden brown and super crisp.',
          'Place potato filling in center, fold neatly into a roll, and serve sizzling hot with fresh coconut chutney.'
        ]
      },
      {
        title: 'Gourmet Smoked Chipotle Cheeseburger & Crispy Fries',
        description:
          'Juicy seasoned gourmet patty seared to perfection on a toasted brioche bun with sharp cheddar, caramelized onions, crisp butter lettuce, and smoky chipotle aioli.',
        category: 'Fast Food',
        prepTime: 15,
        cookTime: 15,
        servings: 2,
        image:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80',
        author: marco._id,
        ingredients: [
          '400g freshly ground chuck (80/20 ratio)',
          '2 artisanal brioche burger buns',
          '2 thick slices sharp Wisconsin cheddar cheese',
          '1 large yellow onion, caramelized in butter',
          'Crispy romaine lettuce leaves',
          'Ripe heirloom tomato slices',
          'Pickled dill cucumber chips',
          'Chipotle Aioli: 3 tbsp mayonnaise, 1 tbsp adobo sauce, 1 tsp lime juice, 1/2 clove grated garlic',
          'Sea salt and cracked black pepper'
        ],
        steps: [
          'Divide meat into two balls and gently press into 1/2-inch thick patties. Make a slight indentation in the center.',
          'Season both sides liberally with coarse sea salt and cracked black pepper right before grilling.',
          'Heat a cast-iron skillet on high until smoking. Place patties and sear hard for 3 minutes without moving.',
          'Flip patties, top immediately with cheddar slices, cover with a lid or dome for 2 minutes to melt cheese perfectly.',
          'Toast halved brioche buns on the hot buttered pan until golden brown and crisp.',
          'Spread smoky chipotle aioli on both halves of each bun. Layer bottom bun with lettuce, tomato, cheesy patty, caramelized onions, and pickles.',
          'Cap with top bun and serve immediately with piping hot french fries.'
        ]
      },
      {
        title: 'Mediterranean Quinoa Salad with Lemon Herb Vinaigrette',
        description:
          'A vibrant nutrient-dense superfood bowl loaded with fluffy organic quinoa, crisp English cucumbers, kalamata olives, cherry tomatoes, and crumbled feta cheese.',
        category: 'Healthy Food',
        prepTime: 15,
        cookTime: 15,
        servings: 4,
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
        author: priya._id,
        ingredients: [
          '1 cup tri-color quinoa, rinsed thoroughly',
          '2 cups water or vegetable broth',
          '1 cup English cucumber, diced',
          '1 cup sweet cherry tomatoes, halved',
          '1/2 cup pitted Kalamata olives, sliced',
          '1/2 cup crumbled Greek sheep feta cheese',
          '1/3 cup fresh Italian flat-leaf parsley, chopped',
          '1/4 cup red onion, finely diced',
          'Dressing: 1/4 cup extra virgin olive oil, juice of 1 large lemon, 1 tsp dried oregano, 1 clove garlic minced, salt and pepper'
        ],
        steps: [
          'In a small pot, combine rinsed quinoa and vegetable broth. Bring to a boil, then cover and simmer on low for 15 minutes.',
          'Remove from heat and let sit covered for 5 minutes. Fluff with a fork and spread on a sheet pan to cool to room temperature.',
          'In a small mason jar, shake together olive oil, fresh lemon juice, minced garlic, dried oregano, salt, and black pepper.',
          'In a spacious salad bowl, combine cooled quinoa, diced cucumber, halved tomatoes, sliced olives, and red onion.',
          'Pour the zesty lemon herb dressing over the salad and toss thoroughly to coat all ingredients.',
          'Gently fold in crumbled feta and fresh parsley right before serving. Chill for 30 minutes for best flavor development.'
        ]
      },
      {
        title: 'Refreshing Mango Passionfruit Mint Cooler',
        description:
          'Tropical sunshine in a chilled glass! Made with fresh Alphonso mango pulp, tangy passionfruit purée, muddled garden mint, fresh lime, and sparkling soda.',
        category: 'Beverages',
        prepTime: 10,
        cookTime: 0,
        servings: 2,
        image:
          'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80',
        author: tejaswini._id,
        ingredients: [
          '1 cup fresh sweet mango pulp (Alphonso or Kesar)',
          '1/4 cup fresh passionfruit pulp with seeds',
          '15-20 fresh garden mint leaves',
          '2 tbsp freshly squeezed lime juice',
          '2 tbsp agave nectar or simple syrup',
          'Crushed ice cubes',
          '1.5 cups chilled sparkling soda water',
          'Lime wheels and mint sprigs for garnish'
        ],
        steps: [
          'In a sturdy cocktail shaker or pitcher, add fresh mint leaves, lime juice, and agave nectar.',
          'Gently muddle mint leaves with a wooden pestle for 20 seconds to release the natural aromatic oils without tearing.',
          'Stir in sweet mango puree and tart passionfruit pulp until smoothly integrated.',
          'Pack two tall highball glasses to the rim with crushed ice.',
          'Pour the fruity mint base evenly over the ice in both glasses.',
          'Top each glass with chilled sparkling soda water, stir gently with a long bar spoon, and garnish with fresh mint sprigs and lime wheels.'
        ]
      }
    ];

    await Recipe.insertMany(sampleRecipes);

    console.log(`[Seeder]: Successfully created ${users.length} users and ${sampleRecipes.length} recipes!`);
    console.log('[Seeder]: Demo user credentials:');
    console.log('   Email: tejaswini@recipehub.com');
    console.log('   Password: password123');
    process.exit(0);
  } catch (err) {
    console.error('[Seeder Error]:', err.message);
    process.exit(1);
  }
};

seedData();
