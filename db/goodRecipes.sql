-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: goodrecipes1-goodrecipes.d.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'e0783cc6-2f90-11f1-8a7a-5e66e8ae3384:1-210,
f713f104-2ebc-11f1-bcaa-9e56d1c8c1c3:1-150';

--
-- Table structure for table `CATEGORY`
--

DROP TABLE IF EXISTS `CATEGORY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CATEGORY` (
  `category_id` bigint NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CATEGORY`
--

LOCK TABLES `CATEGORY` WRITE;
/*!40000 ALTER TABLE `CATEGORY` DISABLE KEYS */;
INSERT INTO `CATEGORY` VALUES (213149523,'Dinner','The meal at the end of the day'),(343812224,'Beginner-Friendly','Simple recipes ideal for people with little cooking experience.'),(704096437,'Brunch','A late-morning combination of breakfast and lunch foods'),(982281587,'Snack','Small portions of food eaten between meals; quick and easy to prepare or grab.'),(2380021014,'One-Pot Meals','Meals cooked using a single pot or pan for easy cleanup.'),(4072037199,'BBQ & Grilling','Recipes cooked over an open flame or grill.'),(4185470186,'Report Dessert','Sweet treats and baked goods.'),(4779416903,'Lunch','Midday meals that are usually balanced and moderately filling'),(4857880875,'Appetizer','Small dishes served before the main course to stimulate appetite'),(5423729218,'Advanced','More complex recipes requiring technique, time, or specialized skills.'),(6320361144,'Report Breakfast','Morning favorites and quick bites.'),(6744669726,'Party Food','Shareable, crowd-friendly dishes suitable for gatherings.'),(7768993080,'Comfort Food','Warm, hearty dishes that are nostalgic and satisfying.'),(8968853308,'Sides','Complementary dishes served alongside a main course'),(9144123317,'Date Night','Dishes that are visually appealing or a bit more elegant for special occasions.'),(9545775288,'Report Dinner','Savory entrees and comfort meals.'),(9755884365,'Holiday','Special dishes prepared for holidays or celebrations.'),(9920212697,'Meal Prep','Recipes designed to be made in advance and stored for later use.'),(5938504827414773805,'Breakfast','Morning meals and brunch recipes to start the day'),(5938504827414773806,'Desserts','Sweet treats, cakes, and indulgent after dinner recipes'),(5938504827414773807,'Vegetarian','Plant based recipes with no meat or fish'),(5938504827414773808,'Seafood','Recipes featuring fish, shrimp, and other seafood'),(5938504827414773809,'Quick Meals','Recipes that can be prepared and cooked in under 30 minutes');
/*!40000 ALTER TABLE `CATEGORY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `COLLECTION_RECIPE`
--

DROP TABLE IF EXISTS `COLLECTION_RECIPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `COLLECTION_RECIPE` (
  `collection_id` bigint NOT NULL,
  `recipe_id` bigint DEFAULT NULL,
  `added_at` date DEFAULT NULL,
  PRIMARY KEY (`collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `COLLECTION_RECIPE`
--

LOCK TABLES `COLLECTION_RECIPE` WRITE;
/*!40000 ALTER TABLE `COLLECTION_RECIPE` DISABLE KEYS */;
INSERT INTO `COLLECTION_RECIPE` VALUES (5938504827414773830,5938504827414773831,'2026-01-15'),(5938504827414773832,5938504827414773833,'2026-02-03'),(5938504827414773834,5938504827414773835,'2026-02-18'),(5938504827414773836,5938504827414773837,'2026-03-05'),(5938504827414773838,5938504827414773839,'2026-03-12');
/*!40000 ALTER TABLE `COLLECTION_RECIPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CUISINE`
--

DROP TABLE IF EXISTS `CUISINE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CUISINE` (
  `cuisine_id` bigint NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`cuisine_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CUISINE`
--

LOCK TABLES `CUISINE` WRITE;
/*!40000 ALTER TABLE `CUISINE` DISABLE KEYS */;
INSERT INTO `CUISINE` VALUES (20247535,'Ethiopian','Unique flavors with spices and injera bread.'),(97344968,'Portuguese','Known for fresh seafood, custard tarts, and grilled dishes.'),(3498327015,'Caribbean','Bright, spicy dishes with seafood, rice, and tropical flavors.'),(4585609416,'Spanish','Known for tapas, seafood, and dishes like paella.'),(5805824401,'Vietnamese','Fresh herbs, rice noodles, and light, flavorful broths.'),(6645565570,'Korean','Bold, fermented flavors with dishes like kimchi and BBQ.'),(6867316520,'German','Hearty dishes with meats, potatoes, and breads.'),(7064740921,'Chinese','Diverse regional dishes with rice, noodles, and stir-fries.'),(7152422105,'Thai','Balanced flavors combining sweet, sour, salty, and spicy.'),(7196358787,'French','Emphasizes technique, sauces, and rich flavors.'),(8287300431,'Brazilian','Diverse cuisine with grilled meats and tropical ingredients.'),(8788152376,'Turkish','Combines Middle Eastern and Mediterranean influences with grilled meats and spices.'),(8790813837,'Greek','Mediterranean flavors with olive oil, vegetables, and cheeses like feta.'),(9505598145,'Moroccan','Aromatic spices, tagines, and sweet-savory combinations.'),(9715297812,'Lebanese','Fresh, herb-forward dishes with hummus, pita, and grilled meats.'),(5938504827414773815,'Italian','Mediterranean cuisine known for pasta, pizza, and rich sauces'),(5938504827414773816,'Mexican','Bold and flavorful cuisine featuring tacos, enchiladas, and salsas'),(5938504827414773817,'Japanese','Delicate cuisine known for sushi, ramen, and fresh ingredients'),(5938504827414773818,'Indian','Rich and aromatic cuisine featuring curries, spices, and flatbreads'),(5938504827414773819,'American','Comfort food cuisine known for burgers, BBQ, and hearty meals');
/*!40000 ALTER TABLE `CUISINE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DIETARY_FLAG`
--

DROP TABLE IF EXISTS `DIETARY_FLAG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DIETARY_FLAG` (
  `flag_id` bigint NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`flag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DIETARY_FLAG`
--

LOCK TABLES `DIETARY_FLAG` WRITE;
/*!40000 ALTER TABLE `DIETARY_FLAG` DISABLE KEYS */;
INSERT INTO `DIETARY_FLAG` VALUES (220467827,'Low-Sugar','Limits added sugars and sweeteners.'),(348149020,'Paleo','Focuses on whole foods, excluding processed items, grains, and dairy.'),(377934072,'Halal','Prepared according to Islamic dietary laws.'),(1041673862,'Low-Fat','Minimizes fat content, often for heart-healthy diets.'),(1417662205,'Whole30','Follows Whole30 guidelines, eliminating sugar, grains, dairy, and processed foods.'),(1510291973,'Soy-Free','Excludes soy products such as tofu, soy sauce, and soy milk.'),(2743768974,'Diabetic-Friendly','Designed to help manage blood sugar levels.'),(2842573078,'Kosher','Meets Jewish dietary laws regarding ingredient selection and preparation.'),(5787872757,'Keto','Very low-carb, high-fat diet designed to promote ketosis.'),(5938448965,'Egg-Free','Contains no eggs or egg-based ingredients.'),(7873587019,'Vegetarian','Excludes meat, poultry, and seafood, but may include dairy and eggs.'),(7887853290,'Low-Carb','Limits carbohydrates, often focusing on protein and fats.'),(8568724905,'Heart-Healthy','Focuses on ingredients that support cardiovascular health.'),(9557561648,'High-Protein','Rich in protein to support muscle building and satiety.'),(9575836930,'Shellfish-Free','Does not include shellfish like shrimp, crab, or lobster.'),(5938504827414773810,'Gluten Free','Recipes that contain no gluten or wheat based ingredients'),(5938504827414773811,'Vegan','Recipes that contain no animal products or byproducts'),(5938504827414773812,'Dairy Free','Recipes that contain no milk cheese or other dairy products'),(5938504827414773813,'Nut Free','Recipes that contain no nuts or nut based ingredients'),(5938504827414773814,'Low Sodium','Recipes that are prepared with minimal salt and sodium');
/*!40000 ALTER TABLE `DIETARY_FLAG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `INGREDIENT`
--

DROP TABLE IF EXISTS `INGREDIENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `INGREDIENT` (
  `ingredient_id` bigint NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ingredient_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `INGREDIENT`
--

LOCK TABLES `INGREDIENT` WRITE;
/*!40000 ALTER TABLE `INGREDIENT` DISABLE KEYS */;
INSERT INTO `INGREDIENT` VALUES (630382025,'Cilantro','A fresh herb with a bright, citrusy flavor used in many cuisines.'),(1179519919,'Parsley','A mild herb used for garnish and adding freshness.'),(1294652858,'Flour','A staple for baking and thickening sauces.'),(1425718463,'Rice','A staple grain that serves as a base for many meals worldwide.'),(1836437377,'Butter','Adds richness and flavor; commonly used in baking and sauteing.'),(2453004614,'Black Pepper','Adds mild heat and depth to savory recipes.'),(2547621575,'Paprika','Adds color and mild sweetness or smokiness depending on the variety.'),(3766330236,'Eggs','Used for structure, binding, and richness in cooking and baking.'),(3896581528,'Oregano','A robust herb often used in tomato-based dishes and meats.'),(4645200801,'Basil','A fragrant herb often used in Italian and Mediterranean dishes.'),(5900675320,'Sugar','Sweetens desserts and balances acidity in sauces.'),(6844607417,'Milk','Adds creaminess to sauces, soups, and baked goods.'),(7392721293,'Cumin','A warm, earthy spice commonly used in Mexican and Indian cooking.'),(7618419632,'Vinegar','Adds acidity and brightness to dishes (e.g., white, apple cider, balsamic).'),(8150779875,'Soy Sauce','A salty, umami-rich sauce used in Asian cooking.'),(8454370677,'Salt','Enhances flavor and balances sweetness or bitterness in dishes.'),(8485120912,'Onion','A foundational ingredient that adds sweetness and depth when cooked.'),(9948584201,'Spaghetti','A type of Italian noodle.'),(5938504827414773790,'Garlic','Aromatic bulb used as a flavoring in cooking'),(5938504827414773791,'Olive Oil','Pressed oil from olives commonly used in cooking'),(5938504827414773792,'All Purpose Flour','Versatile wheat flour used in baking and cooking'),(5938504827414773793,'Chicken Breast','Lean cut of chicken commonly used in many dishes'),(5938504827414773794,'Parmesan Cheese','Hard Italian cheese often grated over pasta dishes');
/*!40000 ALTER TABLE `INGREDIENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RECIPE`
--

DROP TABLE IF EXISTS `RECIPE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RECIPE` (
  `recipe_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `instructions` varchar(500) DEFAULT NULL,
  `prep_time` varchar(20) DEFAULT NULL,
  `cook_time` varchar(20) DEFAULT NULL,
  `servings` int DEFAULT NULL,
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RECIPE`
--

LOCK TABLES `RECIPE` WRITE;
/*!40000 ALTER TABLE `RECIPE` DISABLE KEYS */;
INSERT INTO `RECIPE` VALUES (673384307,5938504827414774000,'Garlic Bread','Buttery toasted bread with garlic','Spread garlic butter on bread, bake until crisp.','5 min','10 min',4),(794556782,5228708692,'Avocado Toast','Toasted sourdough topped with smashed avocado and chili flakes.','Toast bread. Mash avocado. Assemble and season.','10 mins','5 mins',2),(1075583692,5938504827414774000,'Caesar Salad','Crisp salad with creamy dressing','Toss lettuce, croutons, dressing, and parmesan.','10 min','0 min',2),(1698604313,5938504827414774000,'Salmon','good salmon','bake salmon','15 minutes','15 minutes',4),(2321242763,5938504827414774000,'Mac and Cheese','Creamy cheesy pasta','Cook pasta, mix with cheese sauce.','5 min','15 min',3),(2660325344,5938504827414774000,'Omelette','Egg dish with fillings','Cook eggs, add fillings, fold and serve.','5 min','7 min',1),(2875700114,5228708692,'Berry Parfait','Layered yogurt, berries, and granola for a quick breakfast.','Layer Greek yogurt, fresh berries, and granola in a glass. Serve chilled.','8 mins','0 mins',2),(4647871760,6812136032,'Pie','Cozy Pumpkin Pie','bake pie','80 mins','80 mins',8),(4931421518,5938504827414774000,'Fruit Smoothie','Refreshing blended fruit drink','Blend fruit, yogurt, and ice until smooth.','5 min','0 min',2),(5048929643,8290184896,'Lemon Garlic Butter Chicken Pasta','A rich and flavorful pasta dish','Cook pasta.\nCook chicken in oil; set aside.\nSauté garlic in butter, then add cream, lemon, and cheese.\nAdd chicken and pasta; toss and serve.','15 mins','25 mins',10),(5243489253,5938504827414774000,'Fried Rice','Rice stir-fried with veggies and egg','Cook rice, stir fry with veggies, egg, soy sauce.','10 min','15 min',3),(6149340350,5938504827414774000,'Oatmeal','Warm and hearty breakfast','Cook oats with milk or water, add toppings.','2 min','5 min',1),(6369772462,5938504827414774000,'BLT Sandwich','Bacon, lettuce, tomato sandwich','Cook bacon, assemble with lettuce, tomato, mayo.','5 min','10 min',1),(6580918633,5938504827414774000,'Scrambled Eggs','Soft and fluffy eggs','Whisk eggs, cook on low heat, stir continuously.','2 min','5 min',2),(7527454708,5938504827414774000,'Grilled Cheese','Classic toasted sandwich','Butter bread, add cheese, grill until golden.','2 min','8 min',1),(7549164443,5938504827414774000,'Tomato Soup','Warm, creamy tomato soup','Simmer tomatoes, blend, add cream, season.','10 min','20 min',3),(8037120762,5228708692,'Chicken Alfredo Deluxe','Creamy pasta finished with extra parmesan and herbs.','Boil pasta. Cook chicken. Toss with Alfredo sauce and parmesan.','15 mins','25 mins',4),(8322966539,5938504827414774000,'salmon','yummy salmon','bake salmon','15 minutes','15 minutes',3),(9164021454,5938504827414774000,'Chocolate Mug Cake','Quick microwave dessert','Mix ingredients in mug, microwave 1–2 minutes.','3 min','2 min',1),(9379884129,6812136032,'Gyudon','Warm comforting meal','1. Cook beef and onions','30 mins','10 mins',3),(9926456928,5938504827414774000,'Spaghetti Aglio e Olio','Simple garlic and olive oil pasta','Boil pasta. Sauté garlic in olive oil, add chili flakes, toss with pasta.','5 min','15 min',2),(5938504827414773765,5938504827414773766,'Spaghetti Carbonara','A classic Italian pasta dish with a creamy egg and bacon sauce','1. Boil pasta. 2. Fry bacon. 3. Mix eggs and cheese. 4. Combine all ingredients off heat.','10 mins','20 mins',4),(5938504827414773767,5938504827414773768,'Chicken Stir Fry','A quick and easy stir fry with vegetables and chicken in a savory sauce','1. Slice chicken. 2. Chop vegetables. 3. Stir fry chicken. 4. Add vegetables and sauce. 5. Serve over rice.','15 mins','15 mins',3),(5938504827414773769,5938504827414773770,'Avocado Toast','Simple and healthy avocado toast topped with eggs and seasoning','1. Toast bread. 2. Mash avocado. 3. Spread on toast. 4. Top with fried egg and seasoning.','5 mins','5 mins',1),(5938504827414773771,5938504827414773772,'Beef Tacos','Seasoned ground beef tacos with fresh toppings and salsa','1. Brown beef. 2. Add taco seasoning. 3. Warm tortillas. 4. Assemble with toppings.','10 mins','20 mins',6),(5938504827414773773,5938504827414773774,'Banana Pancakes','Fluffy pancakes made with ripe bananas and a hint of cinnamon','1. Mash bananas. 2. Mix with eggs and flour. 3. Add cinnamon. 4. Cook on griddle until golden.','10 mins','15 mins',8);
/*!40000 ALTER TABLE `RECIPE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RECIPE_CATEGORY`
--

DROP TABLE IF EXISTS `RECIPE_CATEGORY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RECIPE_CATEGORY` (
  `recipe_id` bigint NOT NULL,
  `category_id` bigint DEFAULT NULL,
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RECIPE_CATEGORY`
--

LOCK TABLES `RECIPE_CATEGORY` WRITE;
/*!40000 ALTER TABLE `RECIPE_CATEGORY` DISABLE KEYS */;
INSERT INTO `RECIPE_CATEGORY` VALUES (794556782,6320361144),(1629323710,4185470186),(4427594650,4185470186),(6697516447,4185470186),(8037120762,9545775288),(5938504827414773850,5938504827414773851),(5938504827414773852,5938504827414773853),(5938504827414773854,5938504827414773855),(5938504827414773856,5938504827414773857),(5938504827414773858,5938504827414773859);
/*!40000 ALTER TABLE `RECIPE_CATEGORY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RECIPE_COLLECTION`
--

DROP TABLE IF EXISTS `RECIPE_COLLECTION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RECIPE_COLLECTION` (
  `collection_id` bigint NOT NULL,
  `user_id` bigint DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  `shared_with` int DEFAULT NULL,
  `privacy_status` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`collection_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RECIPE_COLLECTION`
--

LOCK TABLES `RECIPE_COLLECTION` WRITE;
/*!40000 ALTER TABLE `RECIPE_COLLECTION` DISABLE KEYS */;
INSERT INTO `RECIPE_COLLECTION` VALUES (5938504827414773795,5938504827414773796,'Weeknight Dinners','Quick and easy meals for busy weeknights',3,'public'),(5938504827414773797,5938504827414773798,'Healthy Meals','Low calorie and nutritious recipes',5,'public'),(5938504827414773799,5938504827414773800,'Desserts','Sweet treats and indulgent desserts',2,'private'),(5938504827414773801,5938504827414773802,'BBQ Favorites','Best recipes for grilling and outdoor cooking',8,'shared'),(5938504827414773803,5938504827414773804,'Breakfast Ideas','Morning recipes to start the day right',4,'private');
/*!40000 ALTER TABLE `RECIPE_COLLECTION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RECIPE_CUISINE`
--

DROP TABLE IF EXISTS `RECIPE_CUISINE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RECIPE_CUISINE` (
  `recipe_id` bigint NOT NULL,
  `cuisine_id` bigint DEFAULT NULL,
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RECIPE_CUISINE`
--

LOCK TABLES `RECIPE_CUISINE` WRITE;
/*!40000 ALTER TABLE `RECIPE_CUISINE` DISABLE KEYS */;
INSERT INTO `RECIPE_CUISINE` VALUES (5938504827414773860,5938504827414773861),(5938504827414773862,5938504827414773863),(5938504827414773864,5938504827414773865),(5938504827414773866,5938504827414773867),(5938504827414773868,5938504827414773869);
/*!40000 ALTER TABLE `RECIPE_CUISINE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RECIPE_DIETARYFLAG`
--

DROP TABLE IF EXISTS `RECIPE_DIETARYFLAG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RECIPE_DIETARYFLAG` (
  `recipe_id` bigint NOT NULL,
  `flag_id` bigint DEFAULT NULL,
  `notes` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RECIPE_DIETARYFLAG`
--

LOCK TABLES `RECIPE_DIETARYFLAG` WRITE;
/*!40000 ALTER TABLE `RECIPE_DIETARYFLAG` DISABLE KEYS */;
INSERT INTO `RECIPE_DIETARYFLAG` VALUES (5938504827414773840,5938504827414773841,'Can substitute almond milk for a dairy free version'),(5938504827414773842,5938504827414773843,'Use tamari instead of soy sauce to keep it gluten free'),(5938504827414773844,5938504827414773845,'Replace honey with maple syrup to make fully vegan'),(5938504827414773846,5938504827414773847,'Contains no nuts but prepared in a facility that handles nuts'),(5938504827414773848,5938504827414773849,'Reduce or omit added salt to keep sodium levels low');
/*!40000 ALTER TABLE `RECIPE_DIETARYFLAG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RECIPE_INGREDIENT`
--

DROP TABLE IF EXISTS `RECIPE_INGREDIENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RECIPE_INGREDIENT` (
  `recipe_id` bigint NOT NULL,
  `ingredient_id` bigint DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unit` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RECIPE_INGREDIENT`
--

LOCK TABLES `RECIPE_INGREDIENT` WRITE;
/*!40000 ALTER TABLE `RECIPE_INGREDIENT` DISABLE KEYS */;
INSERT INTO `RECIPE_INGREDIENT` VALUES (5938504827414773820,5938504827414773821,2,'cups'),(5938504827414773822,5938504827414773823,3,'tbsp'),(5938504827414773824,5938504827414773825,1,'lbs'),(5938504827414773826,5938504827414773827,4,'cloves'),(5938504827414773828,5938504827414773829,500,'grams');
/*!40000 ALTER TABLE `RECIPE_INGREDIENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REVIEW`
--

DROP TABLE IF EXISTS `REVIEW`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REVIEW` (
  `review_id` bigint NOT NULL,
  `recipe_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `comment` varchar(500) DEFAULT NULL,
  `rating` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`review_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REVIEW`
--

LOCK TABLES `REVIEW` WRITE;
/*!40000 ALTER TABLE `REVIEW` DISABLE KEYS */;
INSERT INTO `REVIEW` VALUES (1,673384307,8290184896,'Absolutely delicious! The spices were perfect.','5'),(2,1075583692,8290184896,'A bit too salty for my taste, but easy to follow.','3'),(3,1698604313,8290184896,'My kids actually ate their vegetables. A miracle!','5'),(4,2321242763,8290184896,'The cooking time was longer than stated in the recipe.','3'),(5,2660325344,8290184896,'Simple, fast, and healthy. New weeknight staple.','4'),(6,4647871760,8290184896,'Texture was a little mushy. Might reduce the water next time.','2'),(7,4931421518,8290184896,'The best chocolate cake I have ever baked!','5'),(8,5048929643,8290184896,'Added some chili flakes for extra kick. Great base recipe.','4'),(9,5243489253,8290184896,'Instructions were a bit confusing at step 4.','3'),(10,5801017003,8290184896,'Five stars! I served this at a dinner party and everyone loved it.','5'),(11,6149340350,8290184896,'Not my favorite. The flavor profile felt a bit flat.','2'),(12,6369772462,8290184896,'Great for meal prep. Holds up well in the fridge.','4'),(13,6580918633,8290184896,'Way too much sugar. I’d recommend cutting it by half.','1'),(349137717,8037120762,5228708692,'Creamy and satisfying weeknight dinner.','5'),(2129219430,673384307,8290184896,'Best garlic bread EVER!','5'),(2856297030,8037120762,5228708692,'Great flavor and easy to make again.','4'),(3957648261,1629323710,5228708692,'Moist cake with deep chocolate flavor.','5'),(6148952898,673384307,8290184896,'This garlic bread is AMAZING!','5'),(5938504827414773775,5938504827414773776,5938504827414773777,'Absolutely loved this recipe! Will definitely be making it again.','5/5'),(5938504827414773778,5938504827414773779,5938504827414773780,'Pretty good but I found it a bit too salty for my taste.','3/5'),(5938504827414773781,5938504827414773782,5938504827414773783,'Super easy to follow and turned out amazing. My family loved it!','5/5'),(5938504827414773784,5938504827414773785,5938504827414773786,'Decent recipe but the instructions could be a bit more detailed.','2/5'),(5938504827414773787,5938504827414773788,5938504827414773789,'One of the best recipes I have tried. Highly recommend to everyone!','4/5');
/*!40000 ALTER TABLE `REVIEW` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `USER`
--

DROP TABLE IF EXISTS `USER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `USER` (
  `user_id` bigint NOT NULL,
  `username` varchar(25) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `USER`
--

LOCK TABLES `USER` WRITE;
/*!40000 ALTER TABLE `USER` DISABLE KEYS */;
INSERT INTO `USER` VALUES (529043608,'ian_c','ian.c@gmail.com','pw123','user'),(1266344049,'jordon','jordon@gmail.com','jordon123','user'),(1278060230,'hannah_t','hannah.t@gmail.com','pw123','user'),(2012127834,'julia_v','julia.v@gmail.com','pw123','user'),(2503444525,'ethan_p','ethan.p@gmail.com','pw123','user'),(3317143229,'minnie_mouse','minnie_mouse@gmail.com','minniemouse123','user'),(3367132169,'roman','roman@gmail.com','ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f','user'),(3622137375,'namrata2','namrata2@gmail.com','1a5c58c015e838b40552824eaab8d05567bd9bfdf78d08ce3c59c0b8d9b590fc','user'),(4020445241,'rolfcopter','epicface','b3fdeac156b45f587a745661b8c2d4dd8757df398967c34b5c2bb573417598c7','user'),(4838823452,'fiona_r','fiona.r@gmail.com','pw123','user'),(5226106370,'david','david@gmail.com','david123','user'),(5228708692,'testuser','testmail','ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae','user'),(5845686982,'michael_d','michael.d@gmail.com','pw123','user'),(6043876980,'lisa_b','lisa.b@gmail.com','pw123','user'),(6812136032,'joylyn','joylyn@gmail.com','joylyn123','user'),(6876572417,'george_l','george.l@gmail.com','pw123','user'),(7254985703,'chris','chris@gmail.com','chris123','user'),(7469275804,'romanhoward2','romahoward2','08514a0d9435bcb5b5cf685d7f0beb53fcff5805deeb833a6e28948a7e8c9848','user'),(7910466774,'kevin_y','kevin.y@gmail.com','pw123','user'),(8290184896,'namrata','namrata@gmail.com','namrata123','user'),(8363203459,'mickey','mickey@gmail.com','mickey123','user'),(8754770184,'namratah','namrata@gmail.com','0c9f4e778faa92deac06dcceac2cf835a1e819a702d4c3348facdfb9c889bbfd','user'),(5938504827414773760,'coolnoodle42','coolnoodle42@gmail.com','password5678','user'),(5938504827414773761,'blazingcomet7','blazingcomet7@gmail.com','password2345','admin'),(5938504827414773762,'frostybyte99','frostybyte99@gmail.com','password3456','user'),(5938504827414773763,'shadowpenguin','shadowpenguin@gmail.com','password4567','admin'),(5938504827414773764,'grapeshifter','grapeshifter@gmail.com','password1111','user');
/*!40000 ALTER TABLE `USER` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-23  9:32:16
