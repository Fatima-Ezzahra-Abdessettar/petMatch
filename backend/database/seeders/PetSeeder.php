<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pet;
use App\Models\User;

class PetSeeder extends Seeder
{
    public function run() :void
    {
        // Map shelter_id → admin user_id
        $adminMap = [
            1 => User::where('username', 'admin1')->first()->id,
            2 => User::where('username', 'admin2')->first()->id,
            3 => User::where('username', 'admin3')->first()->id,
            4 => User::where('username', 'admin4')->first()->id,
            5 => User::where('username', 'admin5')->first()->id,
        ];

        $pets = [
            // Shelter 1
            ['name'=>'Luna','species'=>'dog','type'=>'Golden Retriever','age'=>3,'gender'=>'female','description'=>'Gentle and loving, great with kids and other pets.','profile_picture'=>'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400','status'=>'available','shelter_id'=>1],
            ['name'=>'Charlie','species'=>'dog','type'=>'Beagle','age'=>1,'gender'=>'male','description'=>'Young and curious, great nose for adventure.','profile_picture'=>'https://images.unsplash.com/photo-1622535078397-0c81cc7eae14?w=400','status'=>'available','shelter_id'=>1],
            ['name'=>'Princess','species'=>'cat','type'=>'Gray Tabby','age'=>5,'gender'=>'female','description'=>'Regal and fluffy, requires daily grooming but very affectionate.','profile_picture'=>'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=400','status'=>'available','shelter_id'=>1],
            ['name'=>'Cooper','species'=>'dog','type'=>'Border Collie','age'=>2,'gender'=>'male','description'=>'Highly intelligent and active, needs mental stimulation.','profile_picture'=>'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=400','status'=>'available','shelter_id'=>1],
            ['name'=>'Oscar','species'=>'cat','type'=>'Scottish Fold','age'=>1,'gender'=>'male','description'=>'Unique folded ears, very social and loves being around people.','profile_picture'=>'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=400','status'=>'available','shelter_id'=>1],
            ['name'=>'Felix','species'=>'cat','type'=>'Tuxedo','age'=>4,'gender'=>'male','description'=>'Distinguished black and white markings, playful and sociable.','profile_picture'=>'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=400','status'=>'available','shelter_id'=>1],
            ['name'=>'Snowball','species'=>'cat','type'=>'White Persian','age'=>5,'gender'=>'female','description'=>'Pure white fluffy coat, calm and regal, loves being pampered.','profile_picture'=>'https://images.unsplash.com/photo-1598017720921-946225de6f04?w=400','status'=>'available','shelter_id'=>1],
            ['name'=>'Jack','species'=>'dog','type'=>'Jack Russell Terrier','age'=>2,'gender'=>'male','description'=>'Small but mighty, very energetic and intelligent, loves to dig.','profile_picture'=>'https://images.unsplash.com/photo-1599908758973-b02eb044e5ab?w=400','status'=>'available','shelter_id'=>1],
            ['name'=>'Olive','species'=>'cat','type'=>'Munchkin','age'=>1,'gender'=>'female','description'=>'Short legs but big personality, playful and loves attention.','profile_picture'=>'https://images.unsplash.com/photo-1555595925-69049e7b7682?w=400','status'=>'available','shelter_id'=>1],

            // Shelter 2
            ['name'=>'Whiskers','species'=>'cat','type'=>'Maine Coon','age'=>4,'gender'=>'male','description'=>'Large and fluffy, very gentle giant who loves to be petted.','profile_picture'=>'https://images.unsplash.com/photo-1685271286659-c83faa4f5cb1?w=400','status'=>'available','shelter_id'=>2],
            ['name'=>'Daisy','species'=>'dog','type'=>'Cocker Spaniel','age'=>4,'gender'=>'female','description'=>'Sweet and gentle, perfect lap dog with beautiful coat.','profile_picture'=>'https://images.unsplash.com/photo-1580905767068-18809fd88640?w=400','status'=>'available','shelter_id'=>2],
            ['name'=>'Buddy','species'=>'dog','type'=>'Mixed Breed','age'=>3,'gender'=>'male','description'=>'Friendly mix with lots of personality, great with everyone.','profile_picture'=>'https://images.unsplash.com/photo-1698597296170-0161f572c6da?w=400','status'=>'available','shelter_id'=>2],
            ['name'=>'Smokey','species'=>'cat','type'=>'Orange Tabby','age'=>4,'gender'=>'male','description'=>'Round and cuddly, very calm and easy-going personality.','profile_picture'=>'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400','status'=>'available','shelter_id'=>2],
            ['name'=>'Rosie','species'=>'dog','type'=>'Cavalier','age'=>2,'gender'=>'female','description'=>'Gentle and friendly, perfect companion dog with silky coat.','profile_picture'=>'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400','status'=>'available','shelter_id'=>2],
            ['name'=>'Duchess','species'=>'cat','type'=>'Himalayan','age'=>4,'gender'=>'female','description'=>'Long-haired with color-point pattern, quiet and dignified.','profile_picture'=>'https://images.unsplash.com/photo-1704122810017-5b6ab2170099?w=400','status'=>'available','shelter_id'=>2],
            ['name'=>'Bruno','species'=>'dog','type'=>'Boxer','age'=>4,'gender'=>'male','description'=>'Playful and energetic, great with children and very protective.','profile_picture'=>'https://images.unsplash.com/photo-1637852423152-342403950d2f?w=400','status'=>'available','shelter_id'=>2],
            ['name'=>'Tank','species'=>'dog','type'=>'American Bulldog','age'=>6,'gender'=>'male','description'=>'Muscular but gentle, great with kids, loves to lounge around.','profile_picture'=>'https://images.unsplash.com/photo-1599485209419-033ccf3c8d0c?w=400','status'=>'available','shelter_id'=>2],

            // Shelter 3
            ['name'=>'Max','species'=>'dog','type'=>'Labrador','age'=>2,'gender'=>'male','description'=>'Energetic and playful, loves to fetch and swim.','profile_picture'=>'https://images.unsplash.com/photo-1537204696486-967f1b7198c8?w=400','status'=>'available','shelter_id'=>3],
            ['name'=>'Shadow','species'=>'cat','type'=>'Black Shorthair','age'=>3,'gender'=>'male','description'=>'Mysterious and independent, loves quiet corners.','profile_picture'=>'https://images.unsplash.com/photo-1572897263855-ea51655f9f0b?w=400','status'=>'available','shelter_id'=>3],
            ['name'=>'Cleo','species'=>'cat','type'=>'Russian Blue','age'=>2,'gender'=>'female','description'=>'Elegant and quiet, with beautiful silver-blue coat.','profile_picture'=>'https://images.unsplash.com/photo-1602268867508-b058cb9c3e99?w=400','status'=>'adopted','shelter_id'=>3],
            ['name'=>'Ruby','species'=>'dog','type'=>'Irish Setter','age'=>3,'gender'=>'female','description'=>'Beautiful red coat, energetic and loves outdoor activities.','profile_picture'=>'https://images.unsplash.com/photo-1671011400865-c1194967880a?w=400','status'=>'available','shelter_id'=>3],
            ['name'=>'Honey','species'=>'dog','type'=>'Golden Retriever Mix','age'=>1,'gender'=>'female','description'=>'Sweet puppy with golden coat, loves to learn and please.','profile_picture'=>'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400','status'=>'available','shelter_id'=>3],
            ['name'=>'Luna','species'=>'cat','type'=>'Bombay','age'=>1,'gender'=>'female','description'=>'Sleek black coat, very affectionate and follows owner around.','profile_picture'=>'https://images.unsplash.com/photo-1597366431550-7b151ed08c75?w=500','status'=>'available','shelter_id'=>3],
            ['name'=>'Buster','species'=>'dog','type'=>'Boston Terrier','age'=>3,'gender'=>'male','description'=>'Compact and friendly, tuxedo markings, great apartment dog.','profile_picture'=>'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400','status'=>'adopted','shelter_id'=>3],
            ['name'=>'Chloe','species'=>'cat','type'=>'Sphynx','age'=>3,'gender'=>'female','description'=>'Hairless and warm to touch, very social and loves human company.','profile_picture'=>'https://images.unsplash.com/photo-1626881255770-2397375aad8d?w=400','status'=>'available','shelter_id'=>3],

            // Shelter 4
            ['name'=>'Mittens','species'=>'cat','type'=>'Orange Tabby','age'=>2,'gender'=>'female','description'=>'Vocal and affectionate, loves attention and cuddles.','profile_picture'=>'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400','status'=>'available','shelter_id'=>4],
            ['name'=>'Rocky','species'=>'dog','type'=>'Bulldog','age'=>6,'gender'=>'male','description'=>'Calm and sturdy, loves to relax and watch TV with family.','profile_picture'=>'https://images.unsplash.com/photo-1568315056770-f4a63027dcd3?w=400','status'=>'available','shelter_id'=>4],
            ['name'=>'Patches','species'=>'cat','type'=>'Calico','age'=>3,'gender'=>'female','description'=>'Colorful coat with three colors, playful and loving.','profile_picture'=>'https://images.unsplash.com/photo-1582725461742-8ecd962c260d?w=400','status'=>'available','shelter_id'=>4],
            ['name'=>'Sadie','species'=>'dog','type'=>'Poodle','age'=>5,'gender'=>'female','description'=>'Hypoallergenic and intelligent, well-groomed and trained.','profile_picture'=>'https://images.unsplash.com/photo-1516371535707-512a1e83bb9a?w=400','status'=>'available','shelter_id'=>4],
            ['name'=>'Tiger','species'=>'cat','type'=>'Bengal','age'=>2,'gender'=>'male','description'=>'Exotic spotted coat, very active and loves to climb and explore.','profile_picture'=>'https://images.unsplash.com/photo-1708863827435-931d4491050c?w=400','status'=>'available','shelter_id'=>4],
            ['name'=>'Duke','species'=>'dog','type'=>'Rottweiler','age'=>5,'gender'=>'male','description'=>'Strong and confident, well-trained and gentle with family.','profile_picture'=>'https://images.unsplash.com/photo-1673474025690-eacc81e21daa?w=400','status'=>'available','shelter_id'=>4],
            ['name'=>'Willow','species'=>'cat','type'=>'Abyssinian','age'=>2,'gender'=>'female','description'=>'Active and curious with ticked coat, loves to explore high places.','profile_picture'=>'https://images.unsplash.com/photo-1598935888738-cd2622bcd437?w=400','status'=>'available','shelter_id'=>4],
            ['name'=>'Finn','species'=>'dog','type'=>'Whippet','age'=>2,'gender'=>'male','description'=>'Sleek and fast, gentle nature, loves to run then nap all day.','profile_picture'=>'https://images.unsplash.com/photo-1634810337785-c4d1e1787c68?w=400','status'=>'available','shelter_id'=>4],

            // Shelter 5
            ['name'=>'Bella','species'=>'dog','type'=>'German Shepherd','age'=>5,'gender'=>'female','description'=>'Intelligent and loyal, well-trained and protective.','profile_picture'=>'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400','status'=>'adopted','shelter_id'=>5],
            ['name'=>'Ginger','species'=>'cat','type'=>'Orange Tabby','age'=>1,'gender'=>'female','description'=>'Playful kitten with orange stripes, loves toys and climbing.','profile_picture'=>'https://images.unsplash.com/photo-1667518158994-8b3b2957dd01?w=400','status'=>'available','shelter_id'=>5],
            ['name'=>'Zeus','species'=>'dog','type'=>'Great Dane','age'=>4,'gender'=>'male','description'=>'Gentle giant who thinks he\'s a lap dog, very sweet nature.','profile_picture'=>'https://images.unsplash.com/photo-1676290724711-bd092072a9c4?w=400','status'=>'available','shelter_id'=>5],
            ['name'=>'Milo','species'=>'dog','type'=>'Mixed Breed','age'=>3,'gender'=>'male','description'=>'Docile and relaxed, goes limp when picked up, very affectionate.','profile_picture'=>'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400','status'=>'available','shelter_id'=>5],
            ['name'=>'Maggie','species'=>'dog','type'=>'Siberian Husky','age'=>3,'gender'=>'female','description'=>'Intelligent herding dog with beautiful merle coat, very loyal.','profile_picture'=>'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=400','status'=>'available','shelter_id'=>5],
            ['name'=>'Pepper','species'=>'cat','type'=>'Tortoiseshell','age'=>3,'gender'=>'female','description'=>'Beautiful mottled coat, independent but loving, great mouser.','profile_picture'=>'https://images.unsplash.com/photo-1679614595997-d76eb7595493?w=400','status'=>'available','shelter_id'=>5],
            ['name'=>'Scout','species'=>'dog','type'=>'Siberian Husky','age'=>4,'gender'=>'male','description'=>'Beautiful blue eyes, loves cold weather and running, very vocal.','profile_picture'=>'https://images.unsplash.com/photo-1594316307405-5da4ee12ba55?w=400','status'=>'available','shelter_id'=>5],
        ];

        foreach ($pets as $pet) {
            Pet::create(array_merge($pet, ['added_by' => $adminMap[$pet['shelter_id']]]));
        }
    }
}