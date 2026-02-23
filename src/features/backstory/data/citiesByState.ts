import type { CityOption, StateOption } from "../../../types/backstory";

/**
 * Static runtime dataset: exactly 100 curated cities per state for step-2 selection.
 * Ordering is deterministic to keep search and defaults stable across runs.
 */
export const CITIES_BY_STATE: Record<StateOption["code"], readonly CityOption[]> = {
  "AL": [
    {
      "slug": "huntsville-al",
      "city": "Huntsville",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "birmingham-al",
      "city": "Birmingham",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "montgomery-al",
      "city": "Montgomery",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "mobile-al",
      "city": "Mobile",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "tuscaloosa-al",
      "city": "Tuscaloosa",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "hoover-al",
      "city": "Hoover",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "dothan-al",
      "city": "Dothan",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "auburn-al",
      "city": "Auburn",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "decatur-al",
      "city": "Decatur",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "madison-al",
      "city": "Madison",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "florence-al",
      "city": "Florence",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "phenix-city-al",
      "city": "Phenix City",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "gadsden-al",
      "city": "Gadsden",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "east-florence-al",
      "city": "East Florence",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "prattville-al",
      "city": "Prattville",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "vestavia-hills-al",
      "city": "Vestavia Hills",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "alabaster-al",
      "city": "Alabaster",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "opelika-al",
      "city": "Opelika",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "enterprise-al",
      "city": "Enterprise",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "bessemer-al",
      "city": "Bessemer",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "homewood-al",
      "city": "Homewood",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "athens-al",
      "city": "Athens",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "daphne-al",
      "city": "Daphne",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "northport-al",
      "city": "Northport",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "dixiana-al",
      "city": "Dixiana",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "pelham-al",
      "city": "Pelham",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "prichard-al",
      "city": "Prichard",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "anniston-al",
      "city": "Anniston",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "albertville-al",
      "city": "Albertville",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "oxford-al",
      "city": "Oxford",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "trussville-al",
      "city": "Trussville",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "mountain-brook-al",
      "city": "Mountain Brook",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "selma-al",
      "city": "Selma",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "troy-al",
      "city": "Troy",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "fairhope-al",
      "city": "Fairhope",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "helena-al",
      "city": "Helena",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "tillmans-corner-al",
      "city": "Tillmans Corner",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "foley-al",
      "city": "Foley",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "center-point-al",
      "city": "Center Point",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "hueytown-al",
      "city": "Hueytown",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "talladega-al",
      "city": "Talladega",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "cullman-al",
      "city": "Cullman",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "millbrook-al",
      "city": "Millbrook",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "abbeville-al",
      "city": "Abbeville",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "abernant-al",
      "city": "Abernant",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "adamsville-al",
      "city": "Adamsville",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "addison-al",
      "city": "Addison",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "adger-al",
      "city": "Adger",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "akron-al",
      "city": "Akron",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "alberta-al",
      "city": "Alberta",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "alexander-city-al",
      "city": "Alexander City",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "alexandria-al",
      "city": "Alexandria",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "aliceville-al",
      "city": "Aliceville",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "allgood-al",
      "city": "Allgood",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "alma-al",
      "city": "Alma",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "alpine-al",
      "city": "Alpine",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "alton-al",
      "city": "Alton",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "altoona-al",
      "city": "Altoona",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "andalusia-al",
      "city": "Andalusia",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "anderson-al",
      "city": "Anderson",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "annemanie-al",
      "city": "Annemanie",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "arab-al",
      "city": "Arab",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "ardmore-al",
      "city": "Ardmore",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "ariton-al",
      "city": "Ariton",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "arley-al",
      "city": "Arley",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "arlington-al",
      "city": "Arlington",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "ashford-al",
      "city": "Ashford",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "ashland-al",
      "city": "Ashland",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "ashville-al",
      "city": "Ashville",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "atmore-al",
      "city": "Atmore",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "attalla-al",
      "city": "Attalla",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "auburn-university-al",
      "city": "Auburn University",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "autaugaville-al",
      "city": "Autaugaville",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "axis-al",
      "city": "Axis",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "baileyton-al",
      "city": "Baileyton",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "banks-al",
      "city": "Banks",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "bankston-al",
      "city": "Bankston",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "bay-minette-al",
      "city": "Bay Minette",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "bayou-la-batre-al",
      "city": "Bayou La Batre",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "bear-creek-al",
      "city": "Bear Creek",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "beatrice-al",
      "city": "Beatrice",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "beaverton-al",
      "city": "Beaverton",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "belk-al",
      "city": "Belk",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "bellamy-al",
      "city": "Bellamy",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "belle-mina-al",
      "city": "Belle Mina",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "bellwood-al",
      "city": "Bellwood",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "berry-al",
      "city": "Berry",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "billingsley-al",
      "city": "Billingsley",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "black-al",
      "city": "Black",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "blountsville-al",
      "city": "Blountsville",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "boaz-al",
      "city": "Boaz",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "boligee-al",
      "city": "Boligee",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "bon-air-al",
      "city": "Bon Air",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "bon-secour-al",
      "city": "Bon Secour",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "booth-al",
      "city": "Booth",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "boykin-al",
      "city": "Boykin",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "brantley-al",
      "city": "Brantley",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "bremen-al",
      "city": "Bremen",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "brent-al",
      "city": "Brent",
      "state": "Alabama",
      "stateCode": "AL"
    },
    {
      "slug": "brewton-al",
      "city": "Brewton",
      "state": "Alabama",
      "stateCode": "AL"
    }
  ],
  "AK": [
    {
      "slug": "anchorage-ak",
      "city": "Anchorage",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "fairbanks-ak",
      "city": "Fairbanks",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "juneau-ak",
      "city": "Juneau",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "eagle-river-ak",
      "city": "Eagle River",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "badger-ak",
      "city": "Badger",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "adak-ak",
      "city": "Adak",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "akiachak-ak",
      "city": "Akiachak",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "akiak-ak",
      "city": "Akiak",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "akutan-ak",
      "city": "Akutan",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "alakanuk-ak",
      "city": "Alakanuk",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "aleknagik-ak",
      "city": "Aleknagik",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "allakaket-ak",
      "city": "Allakaket",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "ambler-ak",
      "city": "Ambler",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "anaktuvuk-pass-ak",
      "city": "Anaktuvuk Pass",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "anchor-point-ak",
      "city": "Anchor Point",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "anderson-ak",
      "city": "Anderson",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "angoon-ak",
      "city": "Angoon",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "aniak-ak",
      "city": "Aniak",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "anvik-ak",
      "city": "Anvik",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "arctic-village-ak",
      "city": "Arctic Village",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "atka-ak",
      "city": "Atka",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "atqasuk-ak",
      "city": "Atqasuk",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "auke-bay-ak",
      "city": "Auke Bay",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "barrow-ak",
      "city": "Barrow",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "beaver-ak",
      "city": "Beaver",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "bethel-ak",
      "city": "Bethel",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "bettles-field-ak",
      "city": "Bettles Field",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "big-lake-ak",
      "city": "Big Lake",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "brevig-mission-ak",
      "city": "Brevig Mission",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "buckland-ak",
      "city": "Buckland",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "cantwell-ak",
      "city": "Cantwell",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "central-ak",
      "city": "Central",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "chalkyitsik-ak",
      "city": "Chalkyitsik",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "chefornak-ak",
      "city": "Chefornak",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "chevak-ak",
      "city": "Chevak",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "chicken-ak",
      "city": "Chicken",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "chignik-ak",
      "city": "Chignik",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "chignik-lagoon-ak",
      "city": "Chignik Lagoon",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "chignik-lake-ak",
      "city": "Chignik Lake",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "chitina-ak",
      "city": "Chitina",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "chugiak-ak",
      "city": "Chugiak",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "circle-ak",
      "city": "Circle",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "clam-gulch-ak",
      "city": "Clam Gulch",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "clarks-point-ak",
      "city": "Clarks Point",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "clear-ak",
      "city": "Clear",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "coffman-cove-ak",
      "city": "Coffman Cove",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "cold-bay-ak",
      "city": "Cold Bay",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "cooper-landing-ak",
      "city": "Cooper Landing",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "copper-center-ak",
      "city": "Copper Center",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "cordova-ak",
      "city": "Cordova",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "craig-ak",
      "city": "Craig",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "crooked-creek-ak",
      "city": "Crooked Creek",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "deering-ak",
      "city": "Deering",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "delta-junction-ak",
      "city": "Delta Junction",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "denali-national-park-ak",
      "city": "Denali National Park",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "dillingham-ak",
      "city": "Dillingham",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "douglas-ak",
      "city": "Douglas",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "dutch-harbor-ak",
      "city": "Dutch Harbor",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "eagle-ak",
      "city": "Eagle",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "eek-ak",
      "city": "Eek",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "egegik-ak",
      "city": "Egegik",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "eielson-afb-ak",
      "city": "Eielson Afb",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "ekwok-ak",
      "city": "Ekwok",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "elfin-cove-ak",
      "city": "Elfin Cove",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "elim-ak",
      "city": "Elim",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "elmendorf-afb-ak",
      "city": "Elmendorf Afb",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "emmonak-ak",
      "city": "Emmonak",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "ester-ak",
      "city": "Ester",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "false-pass-ak",
      "city": "False Pass",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "flat-ak",
      "city": "Flat",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "fort-greely-ak",
      "city": "Fort Greely",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "fort-richardson-ak",
      "city": "Fort Richardson",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "fort-wainwright-ak",
      "city": "Fort Wainwright",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "fort-yukon-ak",
      "city": "Fort Yukon",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "gakona-ak",
      "city": "Gakona",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "galena-ak",
      "city": "Galena",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "gambell-ak",
      "city": "Gambell",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "girdwood-ak",
      "city": "Girdwood",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "glennallen-ak",
      "city": "Glennallen",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "goodnews-bay-ak",
      "city": "Goodnews Bay",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "grayling-ak",
      "city": "Grayling",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "gustavus-ak",
      "city": "Gustavus",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "haines-ak",
      "city": "Haines",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "healy-ak",
      "city": "Healy",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "holy-cross-ak",
      "city": "Holy Cross",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "homer-ak",
      "city": "Homer",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "hoonah-ak",
      "city": "Hoonah",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "hooper-bay-ak",
      "city": "Hooper Bay",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "hope-ak",
      "city": "Hope",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "houston-ak",
      "city": "Houston",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "hughes-ak",
      "city": "Hughes",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "huslia-ak",
      "city": "Huslia",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "hydaburg-ak",
      "city": "Hydaburg",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "hyder-ak",
      "city": "Hyder",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "iliamna-ak",
      "city": "Iliamna",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "indian-ak",
      "city": "Indian",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "kake-ak",
      "city": "Kake",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "kaktovik-ak",
      "city": "Kaktovik",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "kalskag-ak",
      "city": "Kalskag",
      "state": "Alaska",
      "stateCode": "AK"
    },
    {
      "slug": "kaltag-ak",
      "city": "Kaltag",
      "state": "Alaska",
      "stateCode": "AK"
    }
  ],
  "AZ": [
    {
      "slug": "phoenix-az",
      "city": "Phoenix",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "tucson-az",
      "city": "Tucson",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "mesa-az",
      "city": "Mesa",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "chandler-az",
      "city": "Chandler",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "gilbert-az",
      "city": "Gilbert",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "glendale-az",
      "city": "Glendale",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "scottsdale-az",
      "city": "Scottsdale",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "maryvale-az",
      "city": "Maryvale",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "peoria-az",
      "city": "Peoria",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "tempe-az",
      "city": "Tempe",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "deer-valley-az",
      "city": "Deer Valley",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "tempe-junction-az",
      "city": "Tempe Junction",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "surprise-az",
      "city": "Surprise",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "alhambra-az",
      "city": "Alhambra",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "yuma-az",
      "city": "Yuma",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "ahwatukee-foothills-az",
      "city": "Ahwatukee Foothills",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "san-tan-valley-az",
      "city": "San Tan Valley",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "avondale-az",
      "city": "Avondale",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "goodyear-az",
      "city": "Goodyear",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "flagstaff-az",
      "city": "Flagstaff",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "casas-adobes-az",
      "city": "Casas Adobes",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "central-city-az",
      "city": "Central City",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "encanto-az",
      "city": "Encanto",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "lake-havasu-city-az",
      "city": "Lake Havasu City",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "casa-grande-az",
      "city": "Casa Grande",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "buckeye-az",
      "city": "Buckeye",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "catalina-foothills-az",
      "city": "Catalina Foothills",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "maricopa-az",
      "city": "Maricopa",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "oro-valley-az",
      "city": "Oro Valley",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "sierra-vista-az",
      "city": "Sierra Vista",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "prescott-valley-az",
      "city": "Prescott Valley",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "prescott-az",
      "city": "Prescott",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "marana-az",
      "city": "Marana",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "bullhead-city-az",
      "city": "Bullhead City",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "apache-junction-az",
      "city": "Apache Junction",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "sun-city-az",
      "city": "Sun City",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "queen-creek-az",
      "city": "Queen Creek",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "el-mirage-az",
      "city": "El Mirage",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "san-luis-az",
      "city": "San Luis",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "florence-az",
      "city": "Florence",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "kingman-az",
      "city": "Kingman",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "drexel-heights-az",
      "city": "Drexel Heights",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "fortuna-foothills-az",
      "city": "Fortuna Foothills",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "sahuarita-az",
      "city": "Sahuarita",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "sun-city-west-az",
      "city": "Sun City West",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "fountain-hills-az",
      "city": "Fountain Hills",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "anthem-az",
      "city": "Anthem",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "green-valley-az",
      "city": "Green Valley",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "nogales-az",
      "city": "Nogales",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "rio-rico-az",
      "city": "Rio Rico",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "eloy-az",
      "city": "Eloy",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "tanque-verde-az",
      "city": "Tanque Verde",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "douglas-az",
      "city": "Douglas",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "flowing-wells-az",
      "city": "Flowing Wells",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "payson-az",
      "city": "Payson",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "somerton-az",
      "city": "Somerton",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "aguila-az",
      "city": "Aguila",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "ajo-az",
      "city": "Ajo",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "alpine-az",
      "city": "Alpine",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "amado-az",
      "city": "Amado",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "arivaca-az",
      "city": "Arivaca",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "arizona-city-az",
      "city": "Arizona City",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "arlington-az",
      "city": "Arlington",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "ash-fork-az",
      "city": "Ash Fork",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "bagdad-az",
      "city": "Bagdad",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "bapchule-az",
      "city": "Bapchule",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "bellemont-az",
      "city": "Bellemont",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "benson-az",
      "city": "Benson",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "bisbee-az",
      "city": "Bisbee",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "black-canyon-city-az",
      "city": "Black Canyon City",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "blue-az",
      "city": "Blue",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "blue-gap-az",
      "city": "Blue Gap",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "bouse-az",
      "city": "Bouse",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "bowie-az",
      "city": "Bowie",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "bylas-az",
      "city": "Bylas",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "cameron-az",
      "city": "Cameron",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "camp-verde-az",
      "city": "Camp Verde",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "carefree-az",
      "city": "Carefree",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "cashion-az",
      "city": "Cashion",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "catalina-az",
      "city": "Catalina",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "cave-creek-az",
      "city": "Cave Creek",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "central-az",
      "city": "Central",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "chambers-az",
      "city": "Chambers",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "chandler-heights-az",
      "city": "Chandler Heights",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "chinle-az",
      "city": "Chinle",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "chino-valley-az",
      "city": "Chino Valley",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "chloride-az",
      "city": "Chloride",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "cibecue-az",
      "city": "Cibecue",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "cibola-az",
      "city": "Cibola",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "clarkdale-az",
      "city": "Clarkdale",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "clay-springs-az",
      "city": "Clay Springs",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "claypool-az",
      "city": "Claypool",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "clifton-az",
      "city": "Clifton",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "cochise-az",
      "city": "Cochise",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "colorado-city-az",
      "city": "Colorado City",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "concho-az",
      "city": "Concho",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "congress-az",
      "city": "Congress",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "coolidge-az",
      "city": "Coolidge",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "cornville-az",
      "city": "Cornville",
      "state": "Arizona",
      "stateCode": "AZ"
    },
    {
      "slug": "cortaro-az",
      "city": "Cortaro",
      "state": "Arizona",
      "stateCode": "AZ"
    }
  ],
  "AR": [
    {
      "slug": "little-rock-ar",
      "city": "Little Rock",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "fort-smith-ar",
      "city": "Fort Smith",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "fayetteville-ar",
      "city": "Fayetteville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "springdale-ar",
      "city": "Springdale",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "jonesboro-ar",
      "city": "Jonesboro",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "north-little-rock-ar",
      "city": "North Little Rock",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "conway-ar",
      "city": "Conway",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "rogers-ar",
      "city": "Rogers",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "pine-bluff-ar",
      "city": "Pine Bluff",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bentonville-ar",
      "city": "Bentonville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "hot-springs-ar",
      "city": "Hot Springs",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "benton-ar",
      "city": "Benton",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "sherwood-ar",
      "city": "Sherwood",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "texarkana-ar",
      "city": "Texarkana",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "russellville-ar",
      "city": "Russellville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "jacksonville-ar",
      "city": "Jacksonville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bella-vista-ar",
      "city": "Bella Vista",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "paragould-ar",
      "city": "Paragould",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "cabot-ar",
      "city": "Cabot",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "west-memphis-ar",
      "city": "West Memphis",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "searcy-ar",
      "city": "Searcy",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "van-buren-ar",
      "city": "Van Buren",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bryant-ar",
      "city": "Bryant",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "el-dorado-ar",
      "city": "El Dorado",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "maumelle-ar",
      "city": "Maumelle",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "siloam-springs-ar",
      "city": "Siloam Springs",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "adona-ar",
      "city": "Adona",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "alco-ar",
      "city": "Alco",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "alexander-ar",
      "city": "Alexander",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "alicia-ar",
      "city": "Alicia",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "alix-ar",
      "city": "Alix",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "alleene-ar",
      "city": "Alleene",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "alma-ar",
      "city": "Alma",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "almyra-ar",
      "city": "Almyra",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "alpena-ar",
      "city": "Alpena",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "alpine-ar",
      "city": "Alpine",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "altheimer-ar",
      "city": "Altheimer",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "altus-ar",
      "city": "Altus",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "amagon-ar",
      "city": "Amagon",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "amity-ar",
      "city": "Amity",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "antoine-ar",
      "city": "Antoine",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "arkadelphia-ar",
      "city": "Arkadelphia",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "arkansas-city-ar",
      "city": "Arkansas City",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "armorel-ar",
      "city": "Armorel",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "ash-flat-ar",
      "city": "Ash Flat",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "ashdown-ar",
      "city": "Ashdown",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "atkins-ar",
      "city": "Atkins",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "aubrey-ar",
      "city": "Aubrey",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "augusta-ar",
      "city": "Augusta",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "austin-ar",
      "city": "Austin",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "avoca-ar",
      "city": "Avoca",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bald-knob-ar",
      "city": "Bald Knob",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "banks-ar",
      "city": "Banks",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "barling-ar",
      "city": "Barling",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "barton-ar",
      "city": "Barton",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bassett-ar",
      "city": "Bassett",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bates-ar",
      "city": "Bates",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "batesville-ar",
      "city": "Batesville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bauxite-ar",
      "city": "Bauxite",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bay-ar",
      "city": "Bay",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bearden-ar",
      "city": "Bearden",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "beaver-ar",
      "city": "Beaver",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bee-branch-ar",
      "city": "Bee Branch",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "beebe-ar",
      "city": "Beebe",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "beech-grove-ar",
      "city": "Beech Grove",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "beedeville-ar",
      "city": "Beedeville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "beirne-ar",
      "city": "Beirne",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "belleville-ar",
      "city": "Belleville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "ben-lomond-ar",
      "city": "Ben Lomond",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bergman-ar",
      "city": "Bergman",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "berryville-ar",
      "city": "Berryville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bexar-ar",
      "city": "Bexar",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "big-flat-ar",
      "city": "Big Flat",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bigelow-ar",
      "city": "Bigelow",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "biggers-ar",
      "city": "Biggers",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "birdeye-ar",
      "city": "Birdeye",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "biscoe-ar",
      "city": "Biscoe",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bismarck-ar",
      "city": "Bismarck",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "black-oak-ar",
      "city": "Black Oak",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "black-rock-ar",
      "city": "Black Rock",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "blevins-ar",
      "city": "Blevins",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "blue-mountain-ar",
      "city": "Blue Mountain",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bluff-city-ar",
      "city": "Bluff City",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bluffton-ar",
      "city": "Bluffton",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "blytheville-ar",
      "city": "Blytheville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "board-camp-ar",
      "city": "Board Camp",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "boles-ar",
      "city": "Boles",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bonnerdale-ar",
      "city": "Bonnerdale",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bono-ar",
      "city": "Bono",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "booneville-ar",
      "city": "Booneville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "boswell-ar",
      "city": "Boswell",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bradford-ar",
      "city": "Bradford",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "bradley-ar",
      "city": "Bradley",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "branch-ar",
      "city": "Branch",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "brickeys-ar",
      "city": "Brickeys",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "briggsville-ar",
      "city": "Briggsville",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "brinkley-ar",
      "city": "Brinkley",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "brockwell-ar",
      "city": "Brockwell",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "brookland-ar",
      "city": "Brookland",
      "state": "Arkansas",
      "stateCode": "AR"
    },
    {
      "slug": "buckner-ar",
      "city": "Buckner",
      "state": "Arkansas",
      "stateCode": "AR"
    }
  ],
  "CA": [
    {
      "slug": "los-angeles-ca",
      "city": "Los Angeles",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "san-diego-ca",
      "city": "San Diego",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "san-jose-ca",
      "city": "San Jose",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "san-francisco-ca",
      "city": "San Francisco",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "fresno-ca",
      "city": "Fresno",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "sacramento-ca",
      "city": "Sacramento",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "long-beach-ca",
      "city": "Long Beach",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "oakland-ca",
      "city": "Oakland",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "bakersfield-ca",
      "city": "Bakersfield",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "anaheim-ca",
      "city": "Anaheim",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "riverside-ca",
      "city": "Riverside",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "santa-ana-ca",
      "city": "Santa Ana",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "stockton-ca",
      "city": "Stockton",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "chula-vista-ca",
      "city": "Chula Vista",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "irvine-ca",
      "city": "Irvine",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "fremont-ca",
      "city": "Fremont",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "san-bernardino-ca",
      "city": "San Bernardino",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "fontana-ca",
      "city": "Fontana",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "modesto-ca",
      "city": "Modesto",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "oxnard-ca",
      "city": "Oxnard",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "moreno-valley-ca",
      "city": "Moreno Valley",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "huntington-beach-ca",
      "city": "Huntington Beach",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "glendale-ca",
      "city": "Glendale",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "santa-clarita-ca",
      "city": "Santa Clarita",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "santa-rosa-ca",
      "city": "Santa Rosa",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "oceanside-ca",
      "city": "Oceanside",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "garden-grove-ca",
      "city": "Garden Grove",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "rancho-cucamonga-ca",
      "city": "Rancho Cucamonga",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "ontario-ca",
      "city": "Ontario",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "hollywood-ca",
      "city": "Hollywood",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "elk-grove-ca",
      "city": "Elk Grove",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "corona-ca",
      "city": "Corona",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "lancaster-ca",
      "city": "Lancaster",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "palmdale-ca",
      "city": "Palmdale",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "hayward-ca",
      "city": "Hayward",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "salinas-ca",
      "city": "Salinas",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "sunnyvale-ca",
      "city": "Sunnyvale",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "pomona-ca",
      "city": "Pomona",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "escondido-ca",
      "city": "Escondido",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "valencia-ca",
      "city": "Valencia",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "torrance-ca",
      "city": "Torrance",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "pasadena-ca",
      "city": "Pasadena",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "orange-ca",
      "city": "Orange",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "fullerton-ca",
      "city": "Fullerton",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "van-nuys-ca",
      "city": "Van Nuys",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "roseville-ca",
      "city": "Roseville",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "visalia-ca",
      "city": "Visalia",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "thousand-oaks-ca",
      "city": "Thousand Oaks",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "concord-ca",
      "city": "Concord",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "simi-valley-ca",
      "city": "Simi Valley",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "east-los-angeles-ca",
      "city": "East Los Angeles",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "santa-clara-ca",
      "city": "Santa Clara",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "koreatown-ca",
      "city": "Koreatown",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "victorville-ca",
      "city": "Victorville",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "vallejo-ca",
      "city": "Vallejo",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "chico-ca",
      "city": "Chico",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "berkeley-ca",
      "city": "Berkeley",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "el-monte-ca",
      "city": "El Monte",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "carlsbad-ca",
      "city": "Carlsbad",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "downey-ca",
      "city": "Downey",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "costa-mesa-ca",
      "city": "Costa Mesa",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "fairfield-ca",
      "city": "Fairfield",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "inglewood-ca",
      "city": "Inglewood",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "antioch-ca",
      "city": "Antioch",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "temecula-ca",
      "city": "Temecula",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "murrieta-ca",
      "city": "Murrieta",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "richmond-ca",
      "city": "Richmond",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "west-covina-ca",
      "city": "West Covina",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "norwalk-ca",
      "city": "Norwalk",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "daly-city-ca",
      "city": "Daly City",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "burbank-ca",
      "city": "Burbank",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "santa-maria-ca",
      "city": "Santa Maria",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "universal-city-ca",
      "city": "Universal City",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "clovis-ca",
      "city": "Clovis",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "el-cajon-ca",
      "city": "El Cajon",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "san-mateo-ca",
      "city": "San Mateo",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "rialto-ca",
      "city": "Rialto",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "vista-ca",
      "city": "Vista",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "chinatown-ca",
      "city": "Chinatown",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "compton-ca",
      "city": "Compton",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "mission-viejo-ca",
      "city": "Mission Viejo",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "vacaville-ca",
      "city": "Vacaville",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "ventura-ca",
      "city": "Ventura",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "south-gate-ca",
      "city": "South Gate",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "hesperia-ca",
      "city": "Hesperia",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "carson-ca",
      "city": "Carson",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "santa-monica-ca",
      "city": "Santa Monica",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "san-marcos-ca",
      "city": "San Marcos",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "boyle-heights-ca",
      "city": "Boyle Heights",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "arden-arcade-ca",
      "city": "Arden-arcade",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "westminster-ca",
      "city": "Westminster",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "santa-barbara-ca",
      "city": "Santa Barbara",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "redding-ca",
      "city": "Redding",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "san-leandro-ca",
      "city": "San Leandro",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "hawthorne-ca",
      "city": "Hawthorne",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "livermore-ca",
      "city": "Livermore",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "indio-ca",
      "city": "Indio",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "whittier-ca",
      "city": "Whittier",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "menifee-ca",
      "city": "Menifee",
      "state": "California",
      "stateCode": "CA"
    },
    {
      "slug": "newport-beach-ca",
      "city": "Newport Beach",
      "state": "California",
      "stateCode": "CA"
    }
  ],
  "CO": [
    {
      "slug": "denver-co",
      "city": "Denver",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "colorado-springs-co",
      "city": "Colorado Springs",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "aurora-co",
      "city": "Aurora",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "fort-collins-co",
      "city": "Fort Collins",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "lakewood-co",
      "city": "Lakewood",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "thornton-co",
      "city": "Thornton",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "westminster-co",
      "city": "Westminster",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "arvada-co",
      "city": "Arvada",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "centennial-co",
      "city": "Centennial",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "pueblo-co",
      "city": "Pueblo",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "greeley-co",
      "city": "Greeley",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "boulder-co",
      "city": "Boulder",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "highlands-ranch-co",
      "city": "Highlands Ranch",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "longmont-co",
      "city": "Longmont",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "loveland-co",
      "city": "Loveland",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "broomfield-co",
      "city": "Broomfield",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "grand-junction-co",
      "city": "Grand Junction",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "castle-rock-co",
      "city": "Castle Rock",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "commerce-city-co",
      "city": "Commerce City",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "parker-co",
      "city": "Parker",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "littleton-co",
      "city": "Littleton",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "southglenn-co",
      "city": "Southglenn",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "northglenn-co",
      "city": "Northglenn",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "brighton-co",
      "city": "Brighton",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "englewood-co",
      "city": "Englewood",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "security-widefield-co",
      "city": "Security-widefield",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "ken-caryl-co",
      "city": "Ken Caryl",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "wheat-ridge-co",
      "city": "Wheat Ridge",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "pueblo-west-co",
      "city": "Pueblo West",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "fountain-co",
      "city": "Fountain",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "lafayette-co",
      "city": "Lafayette",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "castlewood-co",
      "city": "Castlewood",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "columbine-co",
      "city": "Columbine",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "windsor-co",
      "city": "Windsor",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "erie-co",
      "city": "Erie",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "evans-co",
      "city": "Evans",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "louisville-co",
      "city": "Louisville",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "golden-co",
      "city": "Golden",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "clifton-co",
      "city": "Clifton",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "montrose-co",
      "city": "Montrose",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "sherrelwood-co",
      "city": "Sherrelwood",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "durango-co",
      "city": "Durango",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "canon-city-co",
      "city": "Canon City",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "cimarron-hills-co",
      "city": "Cimarron Hills",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "greenwood-village-co",
      "city": "Greenwood Village",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "agate-co",
      "city": "Agate",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "aguilar-co",
      "city": "Aguilar",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "akron-co",
      "city": "Akron",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "alamosa-co",
      "city": "Alamosa",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "allenspark-co",
      "city": "Allenspark",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "alma-co",
      "city": "Alma",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "almont-co",
      "city": "Almont",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "amherst-co",
      "city": "Amherst",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "anton-co",
      "city": "Anton",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "antonito-co",
      "city": "Antonito",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "arapahoe-co",
      "city": "Arapahoe",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "arboles-co",
      "city": "Arboles",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "arlington-co",
      "city": "Arlington",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "arriba-co",
      "city": "Arriba",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "aspen-co",
      "city": "Aspen",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "atwood-co",
      "city": "Atwood",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "ault-co",
      "city": "Ault",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "austin-co",
      "city": "Austin",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "avon-co",
      "city": "Avon",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "avondale-co",
      "city": "Avondale",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "bailey-co",
      "city": "Bailey",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "basalt-co",
      "city": "Basalt",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "battlement-mesa-co",
      "city": "Battlement Mesa",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "bayfield-co",
      "city": "Bayfield",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "bedrock-co",
      "city": "Bedrock",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "bellvue-co",
      "city": "Bellvue",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "bennett-co",
      "city": "Bennett",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "berthoud-co",
      "city": "Berthoud",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "bethune-co",
      "city": "Bethune",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "beulah-co",
      "city": "Beulah",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "black-hawk-co",
      "city": "Black Hawk",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "blanca-co",
      "city": "Blanca",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "boncarbo-co",
      "city": "Boncarbo",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "bond-co",
      "city": "Bond",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "boone-co",
      "city": "Boone",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "branson-co",
      "city": "Branson",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "breckenridge-co",
      "city": "Breckenridge",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "briggsdale-co",
      "city": "Briggsdale",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "brush-co",
      "city": "Brush",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "buena-vista-co",
      "city": "Buena Vista",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "buffalo-creek-co",
      "city": "Buffalo Creek",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "burlington-co",
      "city": "Burlington",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "burns-co",
      "city": "Burns",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "byers-co",
      "city": "Byers",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "cahone-co",
      "city": "Cahone",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "calhan-co",
      "city": "Calhan",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "campo-co",
      "city": "Campo",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "capulin-co",
      "city": "Capulin",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "carbondale-co",
      "city": "Carbondale",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "carr-co",
      "city": "Carr",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "cascade-co",
      "city": "Cascade",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "cedaredge-co",
      "city": "Cedaredge",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "center-co",
      "city": "Center",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "central-city-co",
      "city": "Central City",
      "state": "Colorado",
      "stateCode": "CO"
    },
    {
      "slug": "chama-co",
      "city": "Chama",
      "state": "Colorado",
      "stateCode": "CO"
    }
  ],
  "CT": [
    {
      "slug": "bridgeport-ct",
      "city": "Bridgeport",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "new-haven-ct",
      "city": "New Haven",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "stamford-ct",
      "city": "Stamford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "north-stamford-ct",
      "city": "North Stamford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "hartford-ct",
      "city": "Hartford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "waterbury-ct",
      "city": "Waterbury",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "norwalk-ct",
      "city": "Norwalk",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "danbury-ct",
      "city": "Danbury",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "east-norwalk-ct",
      "city": "East Norwalk",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "new-britain-ct",
      "city": "New Britain",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "west-hartford-ct",
      "city": "West Hartford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "bristol-ct",
      "city": "Bristol",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "meriden-ct",
      "city": "Meriden",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "hamden-ct",
      "city": "Hamden",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "fairfield-ct",
      "city": "Fairfield",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "west-haven-ct",
      "city": "West Haven",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "milford-ct",
      "city": "Milford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "stratford-ct",
      "city": "Stratford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "city-of-milford-balance-ct",
      "city": "City Of Milford (balance)",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "east-hartford-ct",
      "city": "East Hartford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "middletown-ct",
      "city": "Middletown",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "enfield-ct",
      "city": "Enfield",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "southington-ct",
      "city": "Southington",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "shelton-ct",
      "city": "Shelton",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "norwich-ct",
      "city": "Norwich",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "trumbull-ct",
      "city": "Trumbull",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "west-torrington-ct",
      "city": "West Torrington",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "torrington-ct",
      "city": "Torrington",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "glastonbury-ct",
      "city": "Glastonbury",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "naugatuck-ct",
      "city": "Naugatuck",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "manchester-ct",
      "city": "Manchester",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "newington-ct",
      "city": "Newington",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "cheshire-ct",
      "city": "Cheshire",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "branford-ct",
      "city": "Branford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "east-haven-ct",
      "city": "East Haven",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "windsor-ct",
      "city": "Windsor",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "new-london-ct",
      "city": "New London",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "wethersfield-ct",
      "city": "Wethersfield",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "mansfield-city-ct",
      "city": "Mansfield City",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "westport-ct",
      "city": "Westport",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "farmington-ct",
      "city": "Farmington",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "south-windsor-ct",
      "city": "South Windsor",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "north-haven-ct",
      "city": "North Haven",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "windham-ct",
      "city": "Windham",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "guilford-ct",
      "city": "Guilford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "bloomfield-ct",
      "city": "Bloomfield",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "darien-ct",
      "city": "Darien",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "montville-center-ct",
      "city": "Montville Center",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "southbury-ct",
      "city": "Southbury",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "new-canaan-ct",
      "city": "New Canaan",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "waterford-ct",
      "city": "Waterford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "madison-ct",
      "city": "Madison",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "avon-ct",
      "city": "Avon",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "ansonia-ct",
      "city": "Ansonia",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "wallingford-center-ct",
      "city": "Wallingford Center",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "wilton-ct",
      "city": "Wilton",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "willimantic-ct",
      "city": "Willimantic",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "wallingford-ct",
      "city": "Wallingford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "plainville-ct",
      "city": "Plainville",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "killingly-center-ct",
      "city": "Killingly Center",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "wolcott-ct",
      "city": "Wolcott",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "seymour-ct",
      "city": "Seymour",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "plainfield-ct",
      "city": "Plainfield",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "storrs-ct",
      "city": "Storrs",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "ledyard-ct",
      "city": "Ledyard",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "abington-ct",
      "city": "Abington",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "amston-ct",
      "city": "Amston",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "andover-ct",
      "city": "Andover",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "ashford-ct",
      "city": "Ashford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "ballouville-ct",
      "city": "Ballouville",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "baltic-ct",
      "city": "Baltic",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "bantam-ct",
      "city": "Bantam",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "barkhamsted-ct",
      "city": "Barkhamsted",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "beacon-falls-ct",
      "city": "Beacon Falls",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "berlin-ct",
      "city": "Berlin",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "bethany-ct",
      "city": "Bethany",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "bethel-ct",
      "city": "Bethel",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "bethlehem-ct",
      "city": "Bethlehem",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "bolton-ct",
      "city": "Bolton",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "botsford-ct",
      "city": "Botsford",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "bozrah-ct",
      "city": "Bozrah",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "bridgewater-ct",
      "city": "Bridgewater",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "broad-brook-ct",
      "city": "Broad Brook",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "brookfield-ct",
      "city": "Brookfield",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "brooklyn-ct",
      "city": "Brooklyn",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "burlington-ct",
      "city": "Burlington",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "canaan-ct",
      "city": "Canaan",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "canterbury-ct",
      "city": "Canterbury",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "canton-ct",
      "city": "Canton",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "canton-center-ct",
      "city": "Canton Center",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "centerbrook-ct",
      "city": "Centerbrook",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "central-village-ct",
      "city": "Central Village",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "chaplin-ct",
      "city": "Chaplin",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "chester-ct",
      "city": "Chester",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "clinton-ct",
      "city": "Clinton",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "cobalt-ct",
      "city": "Cobalt",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "colchester-ct",
      "city": "Colchester",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "colebrook-ct",
      "city": "Colebrook",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "collinsville-ct",
      "city": "Collinsville",
      "state": "Connecticut",
      "stateCode": "CT"
    },
    {
      "slug": "columbia-ct",
      "city": "Columbia",
      "state": "Connecticut",
      "stateCode": "CT"
    }
  ],
  "DE": [
    {
      "slug": "wilmington-de",
      "city": "Wilmington",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "dover-de",
      "city": "Dover",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "newark-de",
      "city": "Newark",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "middletown-de",
      "city": "Middletown",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "bear-de",
      "city": "Bear",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "bethany-beach-de",
      "city": "Bethany Beach",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "bethel-de",
      "city": "Bethel",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "bridgeville-de",
      "city": "Bridgeville",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "camden-wyoming-de",
      "city": "Camden Wyoming",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "cheswold-de",
      "city": "Cheswold",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "claymont-de",
      "city": "Claymont",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "clayton-de",
      "city": "Clayton",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "dagsboro-de",
      "city": "Dagsboro",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "delaware-city-de",
      "city": "Delaware City",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "delmar-de",
      "city": "Delmar",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "dover-afb-de",
      "city": "Dover Afb",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "ellendale-de",
      "city": "Ellendale",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "felton-de",
      "city": "Felton",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "fenwick-island-de",
      "city": "Fenwick Island",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "frankford-de",
      "city": "Frankford",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "frederica-de",
      "city": "Frederica",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "georgetown-de",
      "city": "Georgetown",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "greenwood-de",
      "city": "Greenwood",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "harbeson-de",
      "city": "Harbeson",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "harrington-de",
      "city": "Harrington",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "hartly-de",
      "city": "Hartly",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "hockessin-de",
      "city": "Hockessin",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "houston-de",
      "city": "Houston",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "kenton-de",
      "city": "Kenton",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "kirkwood-de",
      "city": "Kirkwood",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "laurel-de",
      "city": "Laurel",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "lewes-de",
      "city": "Lewes",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "lincoln-de",
      "city": "Lincoln",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "little-creek-de",
      "city": "Little Creek",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "magnolia-de",
      "city": "Magnolia",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "marydel-de",
      "city": "Marydel",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "milford-de",
      "city": "Milford",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "millsboro-de",
      "city": "Millsboro",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "millville-de",
      "city": "Millville",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "milton-de",
      "city": "Milton",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "montchanin-de",
      "city": "Montchanin",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "nassau-de",
      "city": "Nassau",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "new-castle-de",
      "city": "New Castle",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "ocean-view-de",
      "city": "Ocean View",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "odessa-de",
      "city": "Odessa",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "port-penn-de",
      "city": "Port Penn",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "rehoboth-beach-de",
      "city": "Rehoboth Beach",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "rockland-de",
      "city": "Rockland",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "saint-georges-de",
      "city": "Saint Georges",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "seaford-de",
      "city": "Seaford",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "selbyville-de",
      "city": "Selbyville",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "smyrna-de",
      "city": "Smyrna",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "townsend-de",
      "city": "Townsend",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "viola-de",
      "city": "Viola",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "winterthur-de",
      "city": "Winterthur",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "woodside-de",
      "city": "Woodside",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "yorklyn-de",
      "city": "Yorklyn",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "bear-new-castle-county-de",
      "city": "Bear (New Castle County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "bethany-beach-sussex-county-de",
      "city": "Bethany Beach (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "bethel-sussex-county-de",
      "city": "Bethel (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "bridgeville-sussex-county-de",
      "city": "Bridgeville (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "camden-wyoming-kent-county-de",
      "city": "Camden Wyoming (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "cheswold-kent-county-de",
      "city": "Cheswold (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "claymont-new-castle-county-de",
      "city": "Claymont (New Castle County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "clayton-kent-county-de",
      "city": "Clayton (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "dagsboro-sussex-county-de",
      "city": "Dagsboro (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "delaware-city-new-castle-county-de",
      "city": "Delaware City (New Castle County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "delmar-sussex-county-de",
      "city": "Delmar (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "dover-kent-county-de",
      "city": "Dover (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "dover-afb-kent-county-de",
      "city": "Dover Afb (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "ellendale-sussex-county-de",
      "city": "Ellendale (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "felton-kent-county-de",
      "city": "Felton (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "fenwick-island-sussex-county-de",
      "city": "Fenwick Island (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "frankford-sussex-county-de",
      "city": "Frankford (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "frederica-kent-county-de",
      "city": "Frederica (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "georgetown-sussex-county-de",
      "city": "Georgetown (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "greenwood-sussex-county-de",
      "city": "Greenwood (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "harbeson-sussex-county-de",
      "city": "Harbeson (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "harrington-kent-county-de",
      "city": "Harrington (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "hartly-kent-county-de",
      "city": "Hartly (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "hockessin-new-castle-county-de",
      "city": "Hockessin (New Castle County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "houston-kent-county-de",
      "city": "Houston (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "kenton-kent-county-de",
      "city": "Kenton (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "kirkwood-new-castle-county-de",
      "city": "Kirkwood (New Castle County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "laurel-sussex-county-de",
      "city": "Laurel (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "lewes-sussex-county-de",
      "city": "Lewes (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "lincoln-sussex-county-de",
      "city": "Lincoln (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "little-creek-kent-county-de",
      "city": "Little Creek (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "magnolia-kent-county-de",
      "city": "Magnolia (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "marydel-kent-county-de",
      "city": "Marydel (Kent County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "middletown-new-castle-county-de",
      "city": "Middletown (New Castle County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "milford-sussex-county-de",
      "city": "Milford (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "millsboro-sussex-county-de",
      "city": "Millsboro (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "millville-sussex-county-de",
      "city": "Millville (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "milton-sussex-county-de",
      "city": "Milton (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "montchanin-new-castle-county-de",
      "city": "Montchanin (New Castle County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "nassau-sussex-county-de",
      "city": "Nassau (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "new-castle-new-castle-county-de",
      "city": "New Castle (New Castle County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "newark-new-castle-county-de",
      "city": "Newark (New Castle County)",
      "state": "Delaware",
      "stateCode": "DE"
    },
    {
      "slug": "ocean-view-sussex-county-de",
      "city": "Ocean View (Sussex County)",
      "state": "Delaware",
      "stateCode": "DE"
    }
  ],
  "FL": [
    {
      "slug": "jacksonville-fl",
      "city": "Jacksonville",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "miami-fl",
      "city": "Miami",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "tampa-fl",
      "city": "Tampa",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "orlando-fl",
      "city": "Orlando",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "st-petersburg-fl",
      "city": "St. Petersburg",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "hialeah-fl",
      "city": "Hialeah",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "tallahassee-fl",
      "city": "Tallahassee",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "fort-lauderdale-fl",
      "city": "Fort Lauderdale",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "cape-coral-fl",
      "city": "Cape Coral",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "pembroke-pines-fl",
      "city": "Pembroke Pines",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "port-saint-lucie-fl",
      "city": "Port Saint Lucie",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "hollywood-fl",
      "city": "Hollywood",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "gainesville-fl",
      "city": "Gainesville",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "miramar-fl",
      "city": "Miramar",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "coral-springs-fl",
      "city": "Coral Springs",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "west-palm-beach-fl",
      "city": "West Palm Beach",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "palm-bay-fl",
      "city": "Palm Bay",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "clearwater-fl",
      "city": "Clearwater",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "miami-gardens-fl",
      "city": "Miami Gardens",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "pompano-beach-fl",
      "city": "Pompano Beach",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "lakeland-fl",
      "city": "Lakeland",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "brandon-fl",
      "city": "Brandon",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "davie-fl",
      "city": "Davie",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "spring-hill-fl",
      "city": "Spring Hill",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "boca-raton-fl",
      "city": "Boca Raton",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "plantation-fl",
      "city": "Plantation",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "miami-beach-fl",
      "city": "Miami Beach",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "deltona-fl",
      "city": "Deltona",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "lehigh-acres-fl",
      "city": "Lehigh Acres",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "melbourne-fl",
      "city": "Melbourne",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "sunrise-fl",
      "city": "Sunrise",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "palm-coast-fl",
      "city": "Palm Coast",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "largo-fl",
      "city": "Largo",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "homestead-fl",
      "city": "Homestead",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "kendall-fl",
      "city": "Kendall",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "deerfield-beach-fl",
      "city": "Deerfield Beach",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "town-n-country-fl",
      "city": "Town 'n' Country",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "alafaya-fl",
      "city": "Alafaya",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "doral-fl",
      "city": "Doral",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "fort-myers-fl",
      "city": "Fort Myers",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "boynton-beach-fl",
      "city": "Boynton Beach",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "daytona-beach-fl",
      "city": "Daytona Beach",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "lauderhill-fl",
      "city": "Lauderhill",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "riverview-fl",
      "city": "Riverview",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "weston-fl",
      "city": "Weston",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "kissimmee-fl",
      "city": "Kissimmee",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "delray-beach-fl",
      "city": "Delray Beach",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "tamarac-fl",
      "city": "Tamarac",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "carol-city-fl",
      "city": "Carol City",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "jupiter-fl",
      "city": "Jupiter",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "wellington-fl",
      "city": "Wellington",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "north-miami-fl",
      "city": "North Miami",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "north-port-fl",
      "city": "North Port",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "west-hollywood-fl",
      "city": "West Hollywood",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "pine-hills-fl",
      "city": "Pine Hills",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "port-orange-fl",
      "city": "Port Orange",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "fountainebleau-fl",
      "city": "Fountainebleau",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "coconut-creek-fl",
      "city": "Coconut Creek",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "ocala-fl",
      "city": "Ocala",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "sanford-fl",
      "city": "Sanford",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "palm-harbor-fl",
      "city": "Palm Harbor",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "margate-fl",
      "city": "Margate",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "kendale-lakes-fl",
      "city": "Kendale Lakes",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "tamiami-fl",
      "city": "Tamiami",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "sarasota-fl",
      "city": "Sarasota",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "bradenton-fl",
      "city": "Bradenton",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "port-charlotte-fl",
      "city": "Port Charlotte",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "allapattah-fl",
      "city": "Allapattah",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "east-pensacola-heights-fl",
      "city": "East Pensacola Heights",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "pensacola-fl",
      "city": "Pensacola",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "little-havana-fl",
      "city": "Little Havana",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "poinciana-fl",
      "city": "Poinciana",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "palm-beach-gardens-fl",
      "city": "Palm Beach Gardens",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "bonita-springs-fl",
      "city": "Bonita Springs",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "pinellas-park-fl",
      "city": "Pinellas Park",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "the-villages-fl",
      "city": "The Villages",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "coral-gables-fl",
      "city": "Coral Gables",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "the-hammocks-fl",
      "city": "The Hammocks",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "flagami-fl",
      "city": "Flagami",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "apopka-fl",
      "city": "Apopka",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "country-club-fl",
      "city": "Country Club",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "cutler-bay-fl",
      "city": "Cutler Bay",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "titusville-fl",
      "city": "Titusville",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "fort-pierce-fl",
      "city": "Fort Pierce",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "oakland-park-fl",
      "city": "Oakland Park",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "wesley-chapel-fl",
      "city": "Wesley Chapel",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "north-miami-beach-fl",
      "city": "North Miami Beach",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "north-lauderdale-fl",
      "city": "North Lauderdale",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "ocoee-fl",
      "city": "Ocoee",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "altamonte-springs-fl",
      "city": "Altamonte Springs",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "university-fl",
      "city": "University",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "ormond-beach-fl",
      "city": "Ormond Beach",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "carrollwood-village-fl",
      "city": "Carrollwood Village",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "winter-garden-fl",
      "city": "Winter Garden",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "st-johns-fl",
      "city": "St. Johns",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "hallandale-beach-fl",
      "city": "Hallandale Beach",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "north-fort-myers-fl",
      "city": "North Fort Myers",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "princeton-fl",
      "city": "Princeton",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "the-acreage-fl",
      "city": "The Acreage",
      "state": "Florida",
      "stateCode": "FL"
    },
    {
      "slug": "oviedo-fl",
      "city": "Oviedo",
      "state": "Florida",
      "stateCode": "FL"
    }
  ],
  "GA": [
    {
      "slug": "atlanta-ga",
      "city": "Atlanta",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "columbus-ga",
      "city": "Columbus",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "savannah-ga",
      "city": "Savannah",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "athens-ga",
      "city": "Athens",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "south-fulton-ga",
      "city": "South Fulton",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "sandy-springs-ga",
      "city": "Sandy Springs",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "roswell-ga",
      "city": "Roswell",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "macon-ga",
      "city": "Macon",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "johns-creek-ga",
      "city": "Johns Creek",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "albany-ga",
      "city": "Albany",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "warner-robins-ga",
      "city": "Warner Robins",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "alpharetta-ga",
      "city": "Alpharetta",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "marietta-ga",
      "city": "Marietta",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "smyrna-ga",
      "city": "Smyrna",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "valdosta-ga",
      "city": "Valdosta",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "brookhaven-ga",
      "city": "Brookhaven",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "stonecrest-ga",
      "city": "Stonecrest",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "dunwoody-ga",
      "city": "Dunwoody",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "augusta-ga",
      "city": "Augusta",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "peachtree-corners-ga",
      "city": "Peachtree Corners",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "gainesville-ga",
      "city": "Gainesville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "milton-ga",
      "city": "Milton",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "newnan-ga",
      "city": "Newnan",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "mableton-ga",
      "city": "Mableton",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "rome-ga",
      "city": "Rome",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "martinez-ga",
      "city": "Martinez",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "east-point-ga",
      "city": "East Point",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "peachtree-city-ga",
      "city": "Peachtree City",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "dalton-ga",
      "city": "Dalton",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "kennesaw-ga",
      "city": "Kennesaw",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "hinesville-ga",
      "city": "Hinesville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "redan-ga",
      "city": "Redan",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "douglasville-ga",
      "city": "Douglasville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "statesboro-ga",
      "city": "Statesboro",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "lawrenceville-ga",
      "city": "Lawrenceville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "woodstock-ga",
      "city": "Woodstock",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "lagrange-ga",
      "city": "Lagrange",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "duluth-ga",
      "city": "Duluth",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "evans-ga",
      "city": "Evans",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "chamblee-ga",
      "city": "Chamblee",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "stockbridge-ga",
      "city": "Stockbridge",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "tucker-ga",
      "city": "Tucker",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "carrollton-ga",
      "city": "Carrollton",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "canton-ga",
      "city": "Canton",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "mcdonough-ga",
      "city": "Mcdonough",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "griffin-ga",
      "city": "Griffin",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "pooler-ga",
      "city": "Pooler",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "candler-mcafee-ga",
      "city": "Candler-mcafee",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "acworth-ga",
      "city": "Acworth",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "decatur-ga",
      "city": "Decatur",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "sugar-hill-ga",
      "city": "Sugar Hill",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "union-city-ga",
      "city": "Union City",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "cartersville-ga",
      "city": "Cartersville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "snellville-ga",
      "city": "Snellville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "forest-park-ga",
      "city": "Forest Park",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "north-druid-hills-ga",
      "city": "North Druid Hills",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "milledgeville-ga",
      "city": "Milledgeville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "thomasville-ga",
      "city": "Thomasville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "suwanee-ga",
      "city": "Suwanee",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "st-marys-ga",
      "city": "St. Marys",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "fayetteville-ga",
      "city": "Fayetteville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "tifton-ga",
      "city": "Tifton",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "north-decatur-ga",
      "city": "North Decatur",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "norcross-ga",
      "city": "Norcross",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "kingsland-ga",
      "city": "Kingsland",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "calhoun-ga",
      "city": "Calhoun",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "dublin-ga",
      "city": "Dublin",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "brunswick-ga",
      "city": "Brunswick",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "americus-ga",
      "city": "Americus",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "riverdale-ga",
      "city": "Riverdale",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "conyers-ga",
      "city": "Conyers",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "lithia-springs-ga",
      "city": "Lithia Springs",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "perry-ga",
      "city": "Perry",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "winder-ga",
      "city": "Winder",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "belvedere-park-ga",
      "city": "Belvedere Park",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "wilmington-island-ga",
      "city": "Wilmington Island",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "abbeville-ga",
      "city": "Abbeville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "adairsville-ga",
      "city": "Adairsville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "adel-ga",
      "city": "Adel",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "adrian-ga",
      "city": "Adrian",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "ailey-ga",
      "city": "Ailey",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "alamo-ga",
      "city": "Alamo",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "alapaha-ga",
      "city": "Alapaha",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "allenhurst-ga",
      "city": "Allenhurst",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "allentown-ga",
      "city": "Allentown",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "alma-ga",
      "city": "Alma",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "alston-ga",
      "city": "Alston",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "alto-ga",
      "city": "Alto",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "ambrose-ga",
      "city": "Ambrose",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "andersonville-ga",
      "city": "Andersonville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "appling-ga",
      "city": "Appling",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "arabi-ga",
      "city": "Arabi",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "aragon-ga",
      "city": "Aragon",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "argyle-ga",
      "city": "Argyle",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "arlington-ga",
      "city": "Arlington",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "armuchee-ga",
      "city": "Armuchee",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "arnoldsville-ga",
      "city": "Arnoldsville",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "ashburn-ga",
      "city": "Ashburn",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "attapulgus-ga",
      "city": "Attapulgus",
      "state": "Georgia",
      "stateCode": "GA"
    },
    {
      "slug": "auburn-ga",
      "city": "Auburn",
      "state": "Georgia",
      "stateCode": "GA"
    }
  ],
  "HI": [
    {
      "slug": "honolulu-hi",
      "city": "Honolulu",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "east-honolulu-hi",
      "city": "East Honolulu",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "pearl-city-hi",
      "city": "Pearl City",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "makakilo-kapolei-honokai-hale-hi",
      "city": "Makakilo / Kapolei / Honokai Hale",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kalihi-palama-hi",
      "city": "Kalihi-palama",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hilo-hi",
      "city": "Hilo",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "joint-base-pearl-harbor-hickam-hi",
      "city": "Joint Base Pearl Harbor Hickam",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "aliamanu-salt-lakes-foster-village-hi",
      "city": "Aliamanu / Salt Lakes / Foster Village",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kailua-hi",
      "city": "Kailua",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "waipahu-hi",
      "city": "Waipahu",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kaneohe-hi",
      "city": "Kaneohe",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "makiki-lower-punchbowl-tantalus-hi",
      "city": "Makiki / Lower Punchbowl / Tantalus",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hawaii-kai-hi",
      "city": "Hawai'i Kai",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "airport-hi",
      "city": "Airport",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "mccully-moiliili-hi",
      "city": "Mccully - Moiliili",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "mililani-town-hi",
      "city": "Mililani Town",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kahului-hi",
      "city": "Kahului",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "liliha-kapalama-hi",
      "city": "Liliha - Kapalama",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "moiliili-hi",
      "city": "Mo'ili'ili",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "manoa-hi",
      "city": "Manoa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "ewa-gentry-hi",
      "city": "'ewa Gentry",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kihei-hi",
      "city": "Kihei",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kaimuki-hi",
      "city": "Kaimuki",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kalihi-valley-hi",
      "city": "Kalihi Valley",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "waikiki-hi",
      "city": "Waikiki",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "diamond-head-kapahulu-saint-louis-heights-hi",
      "city": "Diamond Head / Kapahulu / Saint Louis Heights",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "niu-valley-hi",
      "city": "Niu Valley",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "ala-moana-kakaako-hi",
      "city": "Ala Moana - Kaka'ako",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "makakilo-hi",
      "city": "Makakilo",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "mililani-mauka-launani-valley-hi",
      "city": "Mililani Mauka / Launani Valley",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "wahiawa-hi",
      "city": "Wahiawa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "ewa-beach-hi",
      "city": "'ewa Beach",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "schofield-barracks-hi",
      "city": "Schofield Barracks",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "nuuanu-punchbowl-hi",
      "city": "Nuuanu - Punchbowl",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kuliouou-kalani-iki-hi",
      "city": "Kuliouou - Kalani Iki",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "koolauloa-hi",
      "city": "Koolauloa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "makakilo-city-hi",
      "city": "Makakilo City",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "wailuku-hi",
      "city": "Wailuku",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kapolei-hi",
      "city": "Kapolei",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "aiea-hi",
      "city": "Aiea",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "anahola-hi",
      "city": "Anahola",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "barbers-point-hi",
      "city": "Barbers Point",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "camp-h-m-smith-hi",
      "city": "Camp H M Smith",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "captain-cook-hi",
      "city": "Captain Cook",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "eleele-hi",
      "city": "Eleele",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "ewa-beach-hi-2",
      "city": "Ewa Beach",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "fort-shafter-hi",
      "city": "Fort Shafter",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "haiku-hi",
      "city": "Haiku",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hakalau-hi",
      "city": "Hakalau",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "haleiwa-hi",
      "city": "Haleiwa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hana-hi",
      "city": "Hana",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hanalei-hi",
      "city": "Hanalei",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hanamaulu-hi",
      "city": "Hanamaulu",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hanapepe-hi",
      "city": "Hanapepe",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hauula-hi",
      "city": "Hauula",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hawaii-national-park-hi",
      "city": "Hawaii National Park",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hawi-hi",
      "city": "Hawi",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hickam-afb-hi",
      "city": "Hickam Afb",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "holualoa-hi",
      "city": "Holualoa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "honaunau-hi",
      "city": "Honaunau",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "honokaa-hi",
      "city": "Honokaa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "honomu-hi",
      "city": "Honomu",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "hoolehua-hi",
      "city": "Hoolehua",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kaaawa-hi",
      "city": "Kaaawa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kahuku-hi",
      "city": "Kahuku",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kailua-kona-hi",
      "city": "Kailua Kona",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kalaheo-hi",
      "city": "Kalaheo",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kalaupapa-hi",
      "city": "Kalaupapa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kamuela-hi",
      "city": "Kamuela",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kapaa-hi",
      "city": "Kapaa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kapaau-hi",
      "city": "Kapaau",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kaumakani-hi",
      "city": "Kaumakani",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kaunakakai-hi",
      "city": "Kaunakakai",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "keaau-hi",
      "city": "Keaau",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kealakekua-hi",
      "city": "Kealakekua",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kealia-hi",
      "city": "Kealia",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "keauhou-hi",
      "city": "Keauhou",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kekaha-hi",
      "city": "Kekaha",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kilauea-hi",
      "city": "Kilauea",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "koloa-hi",
      "city": "Koloa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kualapuu-hi",
      "city": "Kualapuu",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kula-hi",
      "city": "Kula",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kunia-hi",
      "city": "Kunia",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "kurtistown-hi",
      "city": "Kurtistown",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "lahaina-hi",
      "city": "Lahaina",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "laie-hi",
      "city": "Laie",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "lanai-city-hi",
      "city": "Lanai City",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "laupahoehoe-hi",
      "city": "Laupahoehoe",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "lawai-hi",
      "city": "Lawai",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "lihue-hi",
      "city": "Lihue",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "m-c-b-h-kaneohe-bay-hi",
      "city": "M C B H Kaneohe Bay",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "makawao-hi",
      "city": "Makawao",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "makaweli-hi",
      "city": "Makaweli",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "maunaloa-hi",
      "city": "Maunaloa",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "mililani-hi",
      "city": "Mililani",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "mountain-view-hi",
      "city": "Mountain View",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "naalehu-hi",
      "city": "Naalehu",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "ninole-hi",
      "city": "Ninole",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "ocean-view-hi",
      "city": "Ocean View",
      "state": "Hawaii",
      "stateCode": "HI"
    },
    {
      "slug": "ookala-hi",
      "city": "Ookala",
      "state": "Hawaii",
      "stateCode": "HI"
    }
  ],
  "ID": [
    {
      "slug": "boise-id",
      "city": "Boise",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "meridian-id",
      "city": "Meridian",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "nampa-id",
      "city": "Nampa",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "idaho-falls-id",
      "city": "Idaho Falls",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "pocatello-id",
      "city": "Pocatello",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "caldwell-id",
      "city": "Caldwell",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "coeur-dalene-id",
      "city": "Coeur D'alene",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "twin-falls-id",
      "city": "Twin Falls",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "lewiston-id",
      "city": "Lewiston",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "lewiston-orchards-id",
      "city": "Lewiston Orchards",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "post-falls-id",
      "city": "Post Falls",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "rexburg-id",
      "city": "Rexburg",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "moscow-id",
      "city": "Moscow",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "eagle-id",
      "city": "Eagle",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "conda-id",
      "city": "Conda",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "kuna-id",
      "city": "Kuna",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "aberdeen-id",
      "city": "Aberdeen",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "ahsahka-id",
      "city": "Ahsahka",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "albion-id",
      "city": "Albion",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "almo-id",
      "city": "Almo",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "american-falls-id",
      "city": "American Falls",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "arbon-id",
      "city": "Arbon",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "arco-id",
      "city": "Arco",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "arimo-id",
      "city": "Arimo",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "ashton-id",
      "city": "Ashton",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "athol-id",
      "city": "Athol",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "atlanta-id",
      "city": "Atlanta",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "atomic-city-id",
      "city": "Atomic City",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "avery-id",
      "city": "Avery",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "bancroft-id",
      "city": "Bancroft",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "banks-id",
      "city": "Banks",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "basalt-id",
      "city": "Basalt",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "bayview-id",
      "city": "Bayview",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "bellevue-id",
      "city": "Bellevue",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "bern-id",
      "city": "Bern",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "blackfoot-id",
      "city": "Blackfoot",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "blanchard-id",
      "city": "Blanchard",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "bliss-id",
      "city": "Bliss",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "bloomington-id",
      "city": "Bloomington",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "bonners-ferry-id",
      "city": "Bonners Ferry",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "bovill-id",
      "city": "Bovill",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "bruneau-id",
      "city": "Bruneau",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "buhl-id",
      "city": "Buhl",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "burley-id",
      "city": "Burley",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "calder-id",
      "city": "Calder",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "cambridge-id",
      "city": "Cambridge",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "carey-id",
      "city": "Carey",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "careywood-id",
      "city": "Careywood",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "carmen-id",
      "city": "Carmen",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "cascade-id",
      "city": "Cascade",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "castleford-id",
      "city": "Castleford",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "cataldo-id",
      "city": "Cataldo",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "challis-id",
      "city": "Challis",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "chester-id",
      "city": "Chester",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "clark-fork-id",
      "city": "Clark Fork",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "clarkia-id",
      "city": "Clarkia",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "clayton-id",
      "city": "Clayton",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "clifton-id",
      "city": "Clifton",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "cobalt-id",
      "city": "Cobalt",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "cocolalla-id",
      "city": "Cocolalla",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "coeur-d-alene-id",
      "city": "Coeur D Alene",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "colburn-id",
      "city": "Colburn",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "coolin-id",
      "city": "Coolin",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "corral-id",
      "city": "Corral",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "cottonwood-id",
      "city": "Cottonwood",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "council-id",
      "city": "Council",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "craigmont-id",
      "city": "Craigmont",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "culdesac-id",
      "city": "Culdesac",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "dayton-id",
      "city": "Dayton",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "deary-id",
      "city": "Deary",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "declo-id",
      "city": "Declo",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "desmet-id",
      "city": "Desmet",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "dietrich-id",
      "city": "Dietrich",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "dingle-id",
      "city": "Dingle",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "donnelly-id",
      "city": "Donnelly",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "dover-id",
      "city": "Dover",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "downey-id",
      "city": "Downey",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "driggs-id",
      "city": "Driggs",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "dubois-id",
      "city": "Dubois",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "eastport-id",
      "city": "Eastport",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "eden-id",
      "city": "Eden",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "elk-city-id",
      "city": "Elk City",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "elk-river-id",
      "city": "Elk River",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "ellis-id",
      "city": "Ellis",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "emmett-id",
      "city": "Emmett",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "fairfield-id",
      "city": "Fairfield",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "felt-id",
      "city": "Felt",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "fenn-id",
      "city": "Fenn",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "ferdinand-id",
      "city": "Ferdinand",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "fernwood-id",
      "city": "Fernwood",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "filer-id",
      "city": "Filer",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "firth-id",
      "city": "Firth",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "fish-haven-id",
      "city": "Fish Haven",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "fort-hall-id",
      "city": "Fort Hall",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "franklin-id",
      "city": "Franklin",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "fruitland-id",
      "city": "Fruitland",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "fruitvale-id",
      "city": "Fruitvale",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "garden-city-id",
      "city": "Garden City",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "garden-valley-id",
      "city": "Garden Valley",
      "state": "Idaho",
      "stateCode": "ID"
    },
    {
      "slug": "genesee-id",
      "city": "Genesee",
      "state": "Idaho",
      "stateCode": "ID"
    }
  ],
  "IL": [
    {
      "slug": "chicago-il",
      "city": "Chicago",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "aurora-il",
      "city": "Aurora",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "rockford-il",
      "city": "Rockford",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "joliet-il",
      "city": "Joliet",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "naperville-il",
      "city": "Naperville",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "peoria-il",
      "city": "Peoria",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "springfield-il",
      "city": "Springfield",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "north-peoria-il",
      "city": "North Peoria",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "elgin-il",
      "city": "Elgin",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "waukegan-il",
      "city": "Waukegan",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "west-town-il",
      "city": "West Town",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "champaign-il",
      "city": "Champaign",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "near-north-side-il",
      "city": "Near North Side",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "cicero-il",
      "city": "Cicero",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "belmont-cragin-il",
      "city": "Belmont Cragin",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "bloomington-il",
      "city": "Bloomington",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "arlington-heights-il",
      "city": "Arlington Heights",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "evanston-il",
      "city": "Evanston",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "schaumburg-il",
      "city": "Schaumburg",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "bolingbrook-il",
      "city": "Bolingbrook",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "south-lawndale-il",
      "city": "South Lawndale",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "logan-square-il",
      "city": "Logan Square",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "decatur-il",
      "city": "Decatur",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "west-ridge-il",
      "city": "West Ridge",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "palatine-il",
      "city": "Palatine",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "lincoln-park-il",
      "city": "Lincoln Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "portage-park-il",
      "city": "Portage Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "skokie-il",
      "city": "Skokie",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "des-plaines-il",
      "city": "Des Plaines",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "orland-park-il",
      "city": "Orland Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "tinley-park-il",
      "city": "Tinley Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "oak-lawn-il",
      "city": "Oak Lawn",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "irving-park-il",
      "city": "Irving Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "berwyn-il",
      "city": "Berwyn",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "chicago-lawn-il",
      "city": "Chicago Lawn",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "uptown-il",
      "city": "Uptown",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "edgewater-il",
      "city": "Edgewater",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "mount-prospect-il",
      "city": "Mount Prospect",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "rogers-park-il",
      "city": "Rogers Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "normal-il",
      "city": "Normal",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "wheaton-il",
      "city": "Wheaton",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "oak-park-il",
      "city": "Oak Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "hoffman-estates-il",
      "city": "Hoffman Estates",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "albany-park-il",
      "city": "Albany Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "south-shore-il",
      "city": "South Shore",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "downers-grove-il",
      "city": "Downers Grove",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "glenview-il",
      "city": "Glenview",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "elmhurst-il",
      "city": "Elmhurst",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "auburn-gresham-il",
      "city": "Auburn Gresham",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "brighton-park-il",
      "city": "Brighton Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "lombard-il",
      "city": "Lombard",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "dekalb-il",
      "city": "Dekalb",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "ashburn-il",
      "city": "Ashburn",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "moline-il",
      "city": "Moline",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "plainfield-il",
      "city": "Plainfield",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "urbana-il",
      "city": "Urbana",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "belleville-il",
      "city": "Belleville",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "bartlett-il",
      "city": "Bartlett",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "buffalo-grove-il",
      "city": "Buffalo Grove",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "gage-park-il",
      "city": "Gage Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "new-city-il",
      "city": "New City",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "quincy-il",
      "city": "Quincy",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "lincoln-square-il",
      "city": "Lincoln Square",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "streamwood-il",
      "city": "Streamwood",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "crystal-lake-il",
      "city": "Crystal Lake",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "carol-stream-il",
      "city": "Carol Stream",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "avondale-il",
      "city": "Avondale",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "romeoville-il",
      "city": "Romeoville",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "rock-island-il",
      "city": "Rock Island",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "carpentersville-il",
      "city": "Carpentersville",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "hanover-park-il",
      "city": "Hanover Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "wheeling-il",
      "city": "Wheeling",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "park-ridge-il",
      "city": "Park Ridge",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "addison-il",
      "city": "Addison",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "calumet-city-il",
      "city": "Calumet City",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "north-lawndale-il",
      "city": "North Lawndale",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "north-center-il",
      "city": "North Center",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "lower-west-side-il",
      "city": "Lower West Side",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "glendale-heights-il",
      "city": "Glendale Heights",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "oswego-il",
      "city": "Oswego",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "bridgeport-il",
      "city": "Bridgeport",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "northbrook-il",
      "city": "Northbrook",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "chicago-loop-il",
      "city": "Chicago Loop",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "woodridge-il",
      "city": "Woodridge",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "elk-grove-village-il",
      "city": "Elk Grove Village",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "pekin-il",
      "city": "Pekin",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "st-charles-il",
      "city": "St. Charles",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "west-lawn-il",
      "city": "West Lawn",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "greater-grand-crossing-il",
      "city": "Greater Grand Crossing",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "west-englewood-il",
      "city": "West Englewood",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "danville-il",
      "city": "Danville",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "mundelein-il",
      "city": "Mundelein",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "chatham-il",
      "city": "Chatham",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "galesburg-il",
      "city": "Galesburg",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "gurnee-il",
      "city": "Gurnee",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "algonquin-il",
      "city": "Algonquin",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "chicago-heights-il",
      "city": "Chicago Heights",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "niles-il",
      "city": "Niles",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "highland-park-il",
      "city": "Highland Park",
      "state": "Illinois",
      "stateCode": "IL"
    },
    {
      "slug": "north-chicago-il",
      "city": "North Chicago",
      "state": "Illinois",
      "stateCode": "IL"
    }
  ],
  "IN": [
    {
      "slug": "indianapolis-in",
      "city": "Indianapolis",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "fort-wayne-in",
      "city": "Fort Wayne",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "evansville-in",
      "city": "Evansville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "south-bend-in",
      "city": "South Bend",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "carmel-in",
      "city": "Carmel",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "bloomington-in",
      "city": "Bloomington",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "hammond-in",
      "city": "Hammond",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "gary-in",
      "city": "Gary",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "fishers-in",
      "city": "Fishers",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "lafayette-in",
      "city": "Lafayette",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "muncie-in",
      "city": "Muncie",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "terre-haute-in",
      "city": "Terre Haute",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "noblesville-in",
      "city": "Noblesville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "kokomo-in",
      "city": "Kokomo",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "greenwood-in",
      "city": "Greenwood",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "anderson-in",
      "city": "Anderson",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "elkhart-in",
      "city": "Elkhart",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "mishawaka-in",
      "city": "Mishawaka",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "lawrence-in",
      "city": "Lawrence",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "jeffersonville-in",
      "city": "Jeffersonville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "columbus-in",
      "city": "Columbus",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "west-lafayette-in",
      "city": "West Lafayette",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "portage-in",
      "city": "Portage",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "westfield-in",
      "city": "Westfield",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "new-albany-in",
      "city": "New Albany",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "richmond-in",
      "city": "Richmond",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "merrillville-in",
      "city": "Merrillville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "goshen-in",
      "city": "Goshen",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "valparaiso-in",
      "city": "Valparaiso",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "michigan-city-in",
      "city": "Michigan City",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "plainfield-in",
      "city": "Plainfield",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "granger-in",
      "city": "Granger",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "marion-in",
      "city": "Marion",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "crown-point-in",
      "city": "Crown Point",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "schererville-in",
      "city": "Schererville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "east-chicago-in",
      "city": "East Chicago",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "hobart-in",
      "city": "Hobart",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "zionsville-in",
      "city": "Zionsville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "brownsburg-in",
      "city": "Brownsburg",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "franklin-in",
      "city": "Franklin",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "munster-in",
      "city": "Munster",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "highland-in",
      "city": "Highland",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "la-porte-in",
      "city": "La Porte",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "clarksville-in",
      "city": "Clarksville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "greenfield-in",
      "city": "Greenfield",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "fairfield-heights-in",
      "city": "Fairfield Heights",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "seymour-in",
      "city": "Seymour",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "shelbyville-in",
      "city": "Shelbyville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "vincennes-in",
      "city": "Vincennes",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "logansport-in",
      "city": "Logansport",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "new-castle-in",
      "city": "New Castle",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "huntington-in",
      "city": "Huntington",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "broad-ripple-in",
      "city": "Broad Ripple",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "avon-in",
      "city": "Avon",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "griffith-in",
      "city": "Griffith",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "frankfort-in",
      "city": "Frankfort",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "dyer-in",
      "city": "Dyer",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "crawfordsville-in",
      "city": "Crawfordsville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "lebanon-in",
      "city": "Lebanon",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "new-haven-in",
      "city": "New Haven",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "jasper-in",
      "city": "Jasper",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "advance-in",
      "city": "Advance",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "akron-in",
      "city": "Akron",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "alamo-in",
      "city": "Alamo",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "albany-in",
      "city": "Albany",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "albion-in",
      "city": "Albion",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "alexandria-in",
      "city": "Alexandria",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "ambia-in",
      "city": "Ambia",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "amboy-in",
      "city": "Amboy",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "amo-in",
      "city": "Amo",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "andrews-in",
      "city": "Andrews",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "angola-in",
      "city": "Angola",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "arcadia-in",
      "city": "Arcadia",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "arcola-in",
      "city": "Arcola",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "argos-in",
      "city": "Argos",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "arlington-in",
      "city": "Arlington",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "ashley-in",
      "city": "Ashley",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "athens-in",
      "city": "Athens",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "atlanta-in",
      "city": "Atlanta",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "attica-in",
      "city": "Attica",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "atwood-in",
      "city": "Atwood",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "auburn-in",
      "city": "Auburn",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "aurora-in",
      "city": "Aurora",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "austin-in",
      "city": "Austin",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "avilla-in",
      "city": "Avilla",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "avoca-in",
      "city": "Avoca",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "bainbridge-in",
      "city": "Bainbridge",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "bargersville-in",
      "city": "Bargersville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "batesville-in",
      "city": "Batesville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "bath-in",
      "city": "Bath",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "battle-ground-in",
      "city": "Battle Ground",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "bedford-in",
      "city": "Bedford",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "beech-grove-in",
      "city": "Beech Grove",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "bellmore-in",
      "city": "Bellmore",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "bennington-in",
      "city": "Bennington",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "bentonville-in",
      "city": "Bentonville",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "berne-in",
      "city": "Berne",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "bethlehem-in",
      "city": "Bethlehem",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "beverly-shores-in",
      "city": "Beverly Shores",
      "state": "Indiana",
      "stateCode": "IN"
    },
    {
      "slug": "bicknell-in",
      "city": "Bicknell",
      "state": "Indiana",
      "stateCode": "IN"
    }
  ],
  "IA": [
    {
      "slug": "des-moines-ia",
      "city": "Des Moines",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "cedar-rapids-ia",
      "city": "Cedar Rapids",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "davenport-ia",
      "city": "Davenport",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "sioux-city-ia",
      "city": "Sioux City",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "iowa-city-ia",
      "city": "Iowa City",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "waterloo-ia",
      "city": "Waterloo",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "ames-ia",
      "city": "Ames",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "west-des-moines-ia",
      "city": "West Des Moines",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "council-bluffs-ia",
      "city": "Council Bluffs",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "dubuque-ia",
      "city": "Dubuque",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "ankeny-ia",
      "city": "Ankeny",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "urbandale-ia",
      "city": "Urbandale",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "cedar-falls-ia",
      "city": "Cedar Falls",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "marion-ia",
      "city": "Marion",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "bettendorf-ia",
      "city": "Bettendorf",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "marshalltown-ia",
      "city": "Marshalltown",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "mason-city-ia",
      "city": "Mason City",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "clinton-ia",
      "city": "Clinton",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "burlington-ia",
      "city": "Burlington",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "fort-dodge-ia",
      "city": "Fort Dodge",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "ottumwa-ia",
      "city": "Ottumwa",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "muscatine-ia",
      "city": "Muscatine",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "johnston-ia",
      "city": "Johnston",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "coralville-ia",
      "city": "Coralville",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "waukee-ia",
      "city": "Waukee",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "altoona-ia",
      "city": "Altoona",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "north-liberty-ia",
      "city": "North Liberty",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "indianola-ia",
      "city": "Indianola",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "clive-ia",
      "city": "Clive",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "newton-ia",
      "city": "Newton",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "ackley-ia",
      "city": "Ackley",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "ackworth-ia",
      "city": "Ackworth",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "adair-ia",
      "city": "Adair",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "adel-ia",
      "city": "Adel",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "afton-ia",
      "city": "Afton",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "agency-ia",
      "city": "Agency",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "ainsworth-ia",
      "city": "Ainsworth",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "akron-ia",
      "city": "Akron",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "albert-city-ia",
      "city": "Albert City",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "albia-ia",
      "city": "Albia",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "albion-ia",
      "city": "Albion",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "alburnett-ia",
      "city": "Alburnett",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "alden-ia",
      "city": "Alden",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "alexander-ia",
      "city": "Alexander",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "algona-ia",
      "city": "Algona",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "alleman-ia",
      "city": "Alleman",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "allendorf-ia",
      "city": "Allendorf",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "allerton-ia",
      "city": "Allerton",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "allison-ia",
      "city": "Allison",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "alta-ia",
      "city": "Alta",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "alta-vista-ia",
      "city": "Alta Vista",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "alton-ia",
      "city": "Alton",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "alvord-ia",
      "city": "Alvord",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "amana-ia",
      "city": "Amana",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "anamosa-ia",
      "city": "Anamosa",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "andover-ia",
      "city": "Andover",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "andrew-ia",
      "city": "Andrew",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "anita-ia",
      "city": "Anita",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "anthon-ia",
      "city": "Anthon",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "aplington-ia",
      "city": "Aplington",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "arcadia-ia",
      "city": "Arcadia",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "archer-ia",
      "city": "Archer",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "aredale-ia",
      "city": "Aredale",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "argyle-ia",
      "city": "Argyle",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "arion-ia",
      "city": "Arion",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "arispe-ia",
      "city": "Arispe",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "arlington-ia",
      "city": "Arlington",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "armstrong-ia",
      "city": "Armstrong",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "arnolds-park-ia",
      "city": "Arnolds Park",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "arthur-ia",
      "city": "Arthur",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "ashton-ia",
      "city": "Ashton",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "aspinwall-ia",
      "city": "Aspinwall",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "atalissa-ia",
      "city": "Atalissa",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "atkins-ia",
      "city": "Atkins",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "atlantic-ia",
      "city": "Atlantic",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "auburn-ia",
      "city": "Auburn",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "audubon-ia",
      "city": "Audubon",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "aurelia-ia",
      "city": "Aurelia",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "aurora-ia",
      "city": "Aurora",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "austinville-ia",
      "city": "Austinville",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "avoca-ia",
      "city": "Avoca",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "ayrshire-ia",
      "city": "Ayrshire",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "badger-ia",
      "city": "Badger",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "bagley-ia",
      "city": "Bagley",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "baldwin-ia",
      "city": "Baldwin",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "bancroft-ia",
      "city": "Bancroft",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "barnes-city-ia",
      "city": "Barnes City",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "barnum-ia",
      "city": "Barnum",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "batavia-ia",
      "city": "Batavia",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "battle-creek-ia",
      "city": "Battle Creek",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "baxter-ia",
      "city": "Baxter",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "bayard-ia",
      "city": "Bayard",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "beacon-ia",
      "city": "Beacon",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "beaman-ia",
      "city": "Beaman",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "beaver-ia",
      "city": "Beaver",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "bedford-ia",
      "city": "Bedford",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "belle-plaine-ia",
      "city": "Belle Plaine",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "bellevue-ia",
      "city": "Bellevue",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "belmond-ia",
      "city": "Belmond",
      "state": "Iowa",
      "stateCode": "IA"
    },
    {
      "slug": "bennett-ia",
      "city": "Bennett",
      "state": "Iowa",
      "stateCode": "IA"
    }
  ],
  "KS": [
    {
      "slug": "wichita-ks",
      "city": "Wichita",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "overland-park-ks",
      "city": "Overland Park",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "kansas-city-ks",
      "city": "Kansas City",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "olathe-ks",
      "city": "Olathe",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "topeka-ks",
      "city": "Topeka",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "lawrence-ks",
      "city": "Lawrence",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "shawnee-ks",
      "city": "Shawnee",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "manhattan-ks",
      "city": "Manhattan",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "lenexa-ks",
      "city": "Lenexa",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "salina-ks",
      "city": "Salina",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "hutchinson-ks",
      "city": "Hutchinson",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "leavenworth-ks",
      "city": "Leavenworth",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "leawood-ks",
      "city": "Leawood",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "dodge-city-ks",
      "city": "Dodge City",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "garden-city-ks",
      "city": "Garden City",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "emporia-ks",
      "city": "Emporia",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "junction-city-ks",
      "city": "Junction City",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "derby-ks",
      "city": "Derby",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "prairie-village-ks",
      "city": "Prairie Village",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "hays-ks",
      "city": "Hays",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "gardner-ks",
      "city": "Gardner",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "liberal-ks",
      "city": "Liberal",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "pittsburg-ks",
      "city": "Pittsburg",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "newton-ks",
      "city": "Newton",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "great-bend-ks",
      "city": "Great Bend",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "abbyville-ks",
      "city": "Abbyville",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "abilene-ks",
      "city": "Abilene",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "admire-ks",
      "city": "Admire",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "agenda-ks",
      "city": "Agenda",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "agra-ks",
      "city": "Agra",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "albert-ks",
      "city": "Albert",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "alden-ks",
      "city": "Alden",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "alexander-ks",
      "city": "Alexander",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "allen-ks",
      "city": "Allen",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "alma-ks",
      "city": "Alma",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "almena-ks",
      "city": "Almena",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "alta-vista-ks",
      "city": "Alta Vista",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "altamont-ks",
      "city": "Altamont",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "alton-ks",
      "city": "Alton",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "altoona-ks",
      "city": "Altoona",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "americus-ks",
      "city": "Americus",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "andale-ks",
      "city": "Andale",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "andover-ks",
      "city": "Andover",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "anthony-ks",
      "city": "Anthony",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "arcadia-ks",
      "city": "Arcadia",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "argonia-ks",
      "city": "Argonia",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "arkansas-city-ks",
      "city": "Arkansas City",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "arlington-ks",
      "city": "Arlington",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "arma-ks",
      "city": "Arma",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "arnold-ks",
      "city": "Arnold",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "ashland-ks",
      "city": "Ashland",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "assaria-ks",
      "city": "Assaria",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "atchison-ks",
      "city": "Atchison",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "athol-ks",
      "city": "Athol",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "atlanta-ks",
      "city": "Atlanta",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "attica-ks",
      "city": "Attica",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "atwood-ks",
      "city": "Atwood",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "auburn-ks",
      "city": "Auburn",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "augusta-ks",
      "city": "Augusta",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "aurora-ks",
      "city": "Aurora",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "axtell-ks",
      "city": "Axtell",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "baileyville-ks",
      "city": "Baileyville",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "baldwin-city-ks",
      "city": "Baldwin City",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "barnard-ks",
      "city": "Barnard",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "barnes-ks",
      "city": "Barnes",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bartlett-ks",
      "city": "Bartlett",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "basehor-ks",
      "city": "Basehor",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "baxter-springs-ks",
      "city": "Baxter Springs",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bazine-ks",
      "city": "Bazine",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "beattie-ks",
      "city": "Beattie",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "beaumont-ks",
      "city": "Beaumont",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "beeler-ks",
      "city": "Beeler",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "belle-plaine-ks",
      "city": "Belle Plaine",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "belleville-ks",
      "city": "Belleville",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "beloit-ks",
      "city": "Beloit",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "belpre-ks",
      "city": "Belpre",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "belvue-ks",
      "city": "Belvue",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bendena-ks",
      "city": "Bendena",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "benedict-ks",
      "city": "Benedict",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bennington-ks",
      "city": "Bennington",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bentley-ks",
      "city": "Bentley",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "benton-ks",
      "city": "Benton",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bern-ks",
      "city": "Bern",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "berryton-ks",
      "city": "Berryton",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "beverly-ks",
      "city": "Beverly",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bird-city-ks",
      "city": "Bird City",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bison-ks",
      "city": "Bison",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "blue-mound-ks",
      "city": "Blue Mound",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "blue-rapids-ks",
      "city": "Blue Rapids",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bluff-city-ks",
      "city": "Bluff City",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bogue-ks",
      "city": "Bogue",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bonner-springs-ks",
      "city": "Bonner Springs",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bremen-ks",
      "city": "Bremen",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "brewster-ks",
      "city": "Brewster",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bronson-ks",
      "city": "Bronson",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "brookville-ks",
      "city": "Brookville",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "brownell-ks",
      "city": "Brownell",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bucklin-ks",
      "city": "Bucklin",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "bucyrus-ks",
      "city": "Bucyrus",
      "state": "Kansas",
      "stateCode": "KS"
    },
    {
      "slug": "buffalo-ks",
      "city": "Buffalo",
      "state": "Kansas",
      "stateCode": "KS"
    }
  ],
  "KY": [
    {
      "slug": "louisville-ky",
      "city": "Louisville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "lexington-ky",
      "city": "Lexington",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "lexington-fayette-ky",
      "city": "Lexington-fayette",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "meads-ky",
      "city": "Meads",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bowling-green-ky",
      "city": "Bowling Green",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "owensboro-ky",
      "city": "Owensboro",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "covington-ky",
      "city": "Covington",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "richmond-ky",
      "city": "Richmond",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "georgetown-ky",
      "city": "Georgetown",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "florence-ky",
      "city": "Florence",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "hopkinsville-ky",
      "city": "Hopkinsville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "nicholasville-ky",
      "city": "Nicholasville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "elizabethtown-ky",
      "city": "Elizabethtown",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "henderson-ky",
      "city": "Henderson",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "frankfort-ky",
      "city": "Frankfort",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "jeffersontown-ky",
      "city": "Jeffersontown",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "independence-ky",
      "city": "Independence",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "pleasure-ridge-park-ky",
      "city": "Pleasure Ridge Park",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "paducah-ky",
      "city": "Paducah",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "valley-station-ky",
      "city": "Valley Station",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "radcliff-ky",
      "city": "Radcliff",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "ashland-ky",
      "city": "Ashland",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "newburg-ky",
      "city": "Newburg",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "madisonville-ky",
      "city": "Madisonville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "murray-ky",
      "city": "Murray",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "erlanger-ky",
      "city": "Erlanger",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "winchester-ky",
      "city": "Winchester",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "fern-creek-ky",
      "city": "Fern Creek",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "saint-matthews-ky",
      "city": "Saint Matthews",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "okolona-ky",
      "city": "Okolona",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "danville-ky",
      "city": "Danville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "fort-thomas-ky",
      "city": "Fort Thomas",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "burlington-ky",
      "city": "Burlington",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "shively-ky",
      "city": "Shively",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "newport-ky",
      "city": "Newport",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "shelbyville-ky",
      "city": "Shelbyville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "highview-ky",
      "city": "Highview",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "aberdeen-ky",
      "city": "Aberdeen",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "adairville-ky",
      "city": "Adairville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "adams-ky",
      "city": "Adams",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "adolphus-ky",
      "city": "Adolphus",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "ages-brookside-ky",
      "city": "Ages Brookside",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "albany-ky",
      "city": "Albany",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "alexandria-ky",
      "city": "Alexandria",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "allegre-ky",
      "city": "Allegre",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "allen-ky",
      "city": "Allen",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "allensville-ky",
      "city": "Allensville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "almo-ky",
      "city": "Almo",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "alpha-ky",
      "city": "Alpha",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "alvaton-ky",
      "city": "Alvaton",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "annville-ky",
      "city": "Annville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "argillite-ky",
      "city": "Argillite",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "arjay-ky",
      "city": "Arjay",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "arlington-ky",
      "city": "Arlington",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "artemus-ky",
      "city": "Artemus",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "ary-ky",
      "city": "Ary",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "ashcamp-ky",
      "city": "Ashcamp",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "asher-ky",
      "city": "Asher",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "athol-ky",
      "city": "Athol",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "auburn-ky",
      "city": "Auburn",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "augusta-ky",
      "city": "Augusta",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "austin-ky",
      "city": "Austin",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "auxier-ky",
      "city": "Auxier",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "avawam-ky",
      "city": "Avawam",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bagdad-ky",
      "city": "Bagdad",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bakerton-ky",
      "city": "Bakerton",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bandana-ky",
      "city": "Bandana",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "banner-ky",
      "city": "Banner",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "barbourville-ky",
      "city": "Barbourville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bardstown-ky",
      "city": "Bardstown",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bardwell-ky",
      "city": "Bardwell",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "barlow-ky",
      "city": "Barlow",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "baskett-ky",
      "city": "Baskett",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "battletown-ky",
      "city": "Battletown",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "baxter-ky",
      "city": "Baxter",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bays-ky",
      "city": "Bays",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bear-branch-ky",
      "city": "Bear Branch",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "beattyville-ky",
      "city": "Beattyville",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "beaumont-ky",
      "city": "Beaumont",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "beauty-ky",
      "city": "Beauty",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "beaver-ky",
      "city": "Beaver",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "beaver-dam-ky",
      "city": "Beaver Dam",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bedford-ky",
      "city": "Bedford",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bee-spring-ky",
      "city": "Bee Spring",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "beech-creek-ky",
      "city": "Beech Creek",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "beech-grove-ky",
      "city": "Beech Grove",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "beechmont-ky",
      "city": "Beechmont",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "belcher-ky",
      "city": "Belcher",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "belfry-ky",
      "city": "Belfry",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bellevue-ky",
      "city": "Bellevue",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "belton-ky",
      "city": "Belton",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "benham-ky",
      "city": "Benham",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "benton-ky",
      "city": "Benton",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "berea-ky",
      "city": "Berea",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "berry-ky",
      "city": "Berry",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bethany-ky",
      "city": "Bethany",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bethelridge-ky",
      "city": "Bethelridge",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "bethlehem-ky",
      "city": "Bethlehem",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "betsy-layne-ky",
      "city": "Betsy Layne",
      "state": "Kentucky",
      "stateCode": "KY"
    },
    {
      "slug": "beverly-ky",
      "city": "Beverly",
      "state": "Kentucky",
      "stateCode": "KY"
    }
  ],
  "LA": [
    {
      "slug": "new-orleans-la",
      "city": "New Orleans",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "baton-rouge-la",
      "city": "Baton Rouge",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "shreveport-la",
      "city": "Shreveport",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "metairie-terrace-la",
      "city": "Metairie Terrace",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "metairie-la",
      "city": "Metairie",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "lafayette-la",
      "city": "Lafayette",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "lake-charles-la",
      "city": "Lake Charles",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bossier-city-la",
      "city": "Bossier City",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "kenner-la",
      "city": "Kenner",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "monroe-la",
      "city": "Monroe",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "alexandria-la",
      "city": "Alexandria",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "houma-la",
      "city": "Houma",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "marrero-la",
      "city": "Marrero",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "new-iberia-la",
      "city": "New Iberia",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "laplace-la",
      "city": "Laplace",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "central-la",
      "city": "Central",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "slidell-la",
      "city": "Slidell",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "prairieville-la",
      "city": "Prairieville",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "terrytown-la",
      "city": "Terrytown",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "ruston-la",
      "city": "Ruston",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "hammond-la",
      "city": "Hammond",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "harvey-la",
      "city": "Harvey",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "sulphur-la",
      "city": "Sulphur",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bayou-cane-la",
      "city": "Bayou Cane",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "shenandoah-la",
      "city": "Shenandoah",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "natchitoches-la",
      "city": "Natchitoches",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "gretna-la",
      "city": "Gretna",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "chalmette-la",
      "city": "Chalmette",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "opelousas-la",
      "city": "Opelousas",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "zachary-la",
      "city": "Zachary",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "estelle-la",
      "city": "Estelle",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "abbeville-la",
      "city": "Abbeville",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "abita-springs-la",
      "city": "Abita Springs",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "acme-la",
      "city": "Acme",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "addis-la",
      "city": "Addis",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "aimwell-la",
      "city": "Aimwell",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "akers-la",
      "city": "Akers",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "albany-la",
      "city": "Albany",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "ama-la",
      "city": "Ama",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "amelia-la",
      "city": "Amelia",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "amite-la",
      "city": "Amite",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "anacoco-la",
      "city": "Anacoco",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "angie-la",
      "city": "Angie",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "angola-la",
      "city": "Angola",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "arabi-la",
      "city": "Arabi",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "arcadia-la",
      "city": "Arcadia",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "archibald-la",
      "city": "Archibald",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "arnaudville-la",
      "city": "Arnaudville",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "ashland-la",
      "city": "Ashland",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "athens-la",
      "city": "Athens",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "atlanta-la",
      "city": "Atlanta",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "avery-island-la",
      "city": "Avery Island",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "baker-la",
      "city": "Baker",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "baldwin-la",
      "city": "Baldwin",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "ball-la",
      "city": "Ball",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "barataria-la",
      "city": "Barataria",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "barksdale-afb-la",
      "city": "Barksdale Afb",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "basile-la",
      "city": "Basile",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "baskin-la",
      "city": "Baskin",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bastrop-la",
      "city": "Bastrop",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "batchelor-la",
      "city": "Batchelor",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bayou-goula-la",
      "city": "Bayou Goula",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "belcher-la",
      "city": "Belcher",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bell-city-la",
      "city": "Bell City",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "belle-chasse-la",
      "city": "Belle Chasse",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "belle-rose-la",
      "city": "Belle Rose",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "belmont-la",
      "city": "Belmont",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bentley-la",
      "city": "Bentley",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "benton-la",
      "city": "Benton",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bernice-la",
      "city": "Bernice",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "berwick-la",
      "city": "Berwick",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bethany-la",
      "city": "Bethany",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bienville-la",
      "city": "Bienville",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "blanchard-la",
      "city": "Blanchard",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "blanks-la",
      "city": "Blanks",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bogalusa-la",
      "city": "Bogalusa",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bonita-la",
      "city": "Bonita",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "boothville-la",
      "city": "Boothville",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bordelonville-la",
      "city": "Bordelonville",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bourg-la",
      "city": "Bourg",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "boutte-la",
      "city": "Boutte",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "boyce-la",
      "city": "Boyce",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "braithwaite-la",
      "city": "Braithwaite",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "branch-la",
      "city": "Branch",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "breaux-bridge-la",
      "city": "Breaux Bridge",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "brittany-la",
      "city": "Brittany",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "broussard-la",
      "city": "Broussard",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "brusly-la",
      "city": "Brusly",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bueche-la",
      "city": "Bueche",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bunkie-la",
      "city": "Bunkie",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "buras-la",
      "city": "Buras",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "burnside-la",
      "city": "Burnside",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "bush-la",
      "city": "Bush",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "cade-la",
      "city": "Cade",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "calhoun-la",
      "city": "Calhoun",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "calvin-la",
      "city": "Calvin",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "cameron-la",
      "city": "Cameron",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "campti-la",
      "city": "Campti",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "carencro-la",
      "city": "Carencro",
      "state": "Louisiana",
      "stateCode": "LA"
    },
    {
      "slug": "carlisle-la",
      "city": "Carlisle",
      "state": "Louisiana",
      "stateCode": "LA"
    }
  ],
  "ME": [
    {
      "slug": "portland-me",
      "city": "Portland",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "lewiston-me",
      "city": "Lewiston",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bangor-me",
      "city": "Bangor",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "west-scarborough-me",
      "city": "West Scarborough",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "south-portland-me",
      "city": "South Portland",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "south-portland-gardens-me",
      "city": "South Portland Gardens",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "auburn-me",
      "city": "Auburn",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "biddeford-me",
      "city": "Biddeford",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "sanford-me",
      "city": "Sanford",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "saco-me",
      "city": "Saco",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "augusta-me",
      "city": "Augusta",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "westbrook-me",
      "city": "Westbrook",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "waterville-me",
      "city": "Waterville",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "brunswick-me",
      "city": "Brunswick",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "abbot-me",
      "city": "Abbot",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "acton-me",
      "city": "Acton",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "addison-me",
      "city": "Addison",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "albion-me",
      "city": "Albion",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "alfred-me",
      "city": "Alfred",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "alna-me",
      "city": "Alna",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "andover-me",
      "city": "Andover",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "anson-me",
      "city": "Anson",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "ashland-me",
      "city": "Ashland",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "athens-me",
      "city": "Athens",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "aurora-me",
      "city": "Aurora",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bailey-island-me",
      "city": "Bailey Island",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "baileyville-me",
      "city": "Baileyville",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bar-harbor-me",
      "city": "Bar Harbor",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bar-mills-me",
      "city": "Bar Mills",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bass-harbor-me",
      "city": "Bass Harbor",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bath-me",
      "city": "Bath",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bayville-me",
      "city": "Bayville",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "beals-me",
      "city": "Beals",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "belfast-me",
      "city": "Belfast",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "belgrade-me",
      "city": "Belgrade",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "belgrade-lakes-me",
      "city": "Belgrade Lakes",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "benedicta-me",
      "city": "Benedicta",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bernard-me",
      "city": "Bernard",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "berwick-me",
      "city": "Berwick",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bethel-me",
      "city": "Bethel",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "biddeford-pool-me",
      "city": "Biddeford Pool",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bingham-me",
      "city": "Bingham",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "birch-harbor-me",
      "city": "Birch Harbor",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "blaine-me",
      "city": "Blaine",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "blue-hill-me",
      "city": "Blue Hill",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "blue-hill-falls-me",
      "city": "Blue Hill Falls",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "boothbay-me",
      "city": "Boothbay",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "boothbay-harbor-me",
      "city": "Boothbay Harbor",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bowdoin-me",
      "city": "Bowdoin",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bowdoinham-me",
      "city": "Bowdoinham",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bradford-me",
      "city": "Bradford",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bradley-me",
      "city": "Bradley",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bremen-me",
      "city": "Bremen",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "brewer-me",
      "city": "Brewer",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bridgewater-me",
      "city": "Bridgewater",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bridgton-me",
      "city": "Bridgton",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bristol-me",
      "city": "Bristol",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "brooklin-me",
      "city": "Brooklin",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "brooks-me",
      "city": "Brooks",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "brooksville-me",
      "city": "Brooksville",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "brookton-me",
      "city": "Brookton",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "brownfield-me",
      "city": "Brownfield",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "brownville-me",
      "city": "Brownville",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "brownville-junction-me",
      "city": "Brownville Junction",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bryant-pond-me",
      "city": "Bryant Pond",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "buckfield-me",
      "city": "Buckfield",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bucksport-me",
      "city": "Bucksport",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "burlington-me",
      "city": "Burlington",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "burnham-me",
      "city": "Burnham",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "bustins-island-me",
      "city": "Bustins Island",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "buxton-me",
      "city": "Buxton",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "calais-me",
      "city": "Calais",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "cambridge-me",
      "city": "Cambridge",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "camden-me",
      "city": "Camden",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "canaan-me",
      "city": "Canaan",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "canton-me",
      "city": "Canton",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "cape-elizabeth-me",
      "city": "Cape Elizabeth",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "cape-neddick-me",
      "city": "Cape Neddick",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "cape-porpoise-me",
      "city": "Cape Porpoise",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "caratunk-me",
      "city": "Caratunk",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "caribou-me",
      "city": "Caribou",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "carmel-me",
      "city": "Carmel",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "casco-me",
      "city": "Casco",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "castine-me",
      "city": "Castine",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "center-lovell-me",
      "city": "Center Lovell",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "chamberlain-me",
      "city": "Chamberlain",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "charleston-me",
      "city": "Charleston",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "chebeague-island-me",
      "city": "Chebeague Island",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "cherryfield-me",
      "city": "Cherryfield",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "china-village-me",
      "city": "China Village",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "clayton-lake-me",
      "city": "Clayton Lake",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "cliff-island-me",
      "city": "Cliff Island",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "clinton-me",
      "city": "Clinton",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "columbia-falls-me",
      "city": "Columbia Falls",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "coopers-mills-me",
      "city": "Coopers Mills",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "corea-me",
      "city": "Corea",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "corinna-me",
      "city": "Corinna",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "corinth-me",
      "city": "Corinth",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "cornish-me",
      "city": "Cornish",
      "state": "Maine",
      "stateCode": "ME"
    },
    {
      "slug": "costigan-me",
      "city": "Costigan",
      "state": "Maine",
      "stateCode": "ME"
    }
  ],
  "MD": [
    {
      "slug": "baltimore-md",
      "city": "Baltimore",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "columbia-md",
      "city": "Columbia",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "germantown-md",
      "city": "Germantown",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "silver-spring-md",
      "city": "Silver Spring",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "frederick-md",
      "city": "Frederick",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "waldorf-md",
      "city": "Waldorf",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "glen-burnie-md",
      "city": "Glen Burnie",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "gaithersburg-md",
      "city": "Gaithersburg",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "rockville-md",
      "city": "Rockville",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "ellicott-city-md",
      "city": "Ellicott City",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "dundalk-md",
      "city": "Dundalk",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "bethesda-md",
      "city": "Bethesda",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "bowie-md",
      "city": "Bowie",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "towson-md",
      "city": "Towson",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "south-bel-air-md",
      "city": "South Bel Air",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "aspen-hill-md",
      "city": "Aspen Hill",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "wheaton-md",
      "city": "Wheaton",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "bel-air-south-md",
      "city": "Bel Air South",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "gwynn-oak-md",
      "city": "Gwynn Oak",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "potomac-md",
      "city": "Potomac",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "severn-md",
      "city": "Severn",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "north-bethesda-md",
      "city": "North Bethesda",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "catonsville-md",
      "city": "Catonsville",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "annapolis-md",
      "city": "Annapolis",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "hagerstown-md",
      "city": "Hagerstown",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "essex-md",
      "city": "Essex",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "hanover-md",
      "city": "Hanover",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "woodlawn-md",
      "city": "Woodlawn",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "severna-park-md",
      "city": "Severna Park",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "odenton-md",
      "city": "Odenton",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "saint-charles-md",
      "city": "Saint Charles",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "clinton-md",
      "city": "Clinton",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "oxon-hill-glassmanor-md",
      "city": "Oxon Hill-glassmanor",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "north-bel-air-md",
      "city": "North Bel Air",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "olney-md",
      "city": "Olney",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "suitland-silver-hill-md",
      "city": "Suitland-silver Hill",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "chillum-md",
      "city": "Chillum",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "st-charles-md",
      "city": "St. Charles",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "salisbury-md",
      "city": "Salisbury",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "randallstown-md",
      "city": "Randallstown",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "college-park-md",
      "city": "College Park",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "montgomery-village-md",
      "city": "Montgomery Village",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "pikesville-md",
      "city": "Pikesville",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "parkville-md",
      "city": "Parkville",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "owings-mills-md",
      "city": "Owings Mills",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "bel-air-north-md",
      "city": "Bel Air North",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "eldersburg-md",
      "city": "Eldersburg",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "carney-md",
      "city": "Carney",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "south-gate-md",
      "city": "South Gate",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "milford-mill-md",
      "city": "Milford Mill",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "west-elkridge-md",
      "city": "West Elkridge",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "perry-hall-md",
      "city": "Perry Hall",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "crofton-md",
      "city": "Crofton",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "laurel-md",
      "city": "Laurel",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "south-laurel-md",
      "city": "South Laurel",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "reisterstown-md",
      "city": "Reisterstown",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "suitland-md",
      "city": "Suitland",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "edgewood-md",
      "city": "Edgewood",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "lochearn-md",
      "city": "Lochearn",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "middle-river-md",
      "city": "Middle River",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "north-potomac-md",
      "city": "North Potomac",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "scaggsville-md",
      "city": "Scaggsville",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "pasadena-md",
      "city": "Pasadena",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "greenbelt-md",
      "city": "Greenbelt",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "hunt-valley-md",
      "city": "Hunt Valley",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "fort-washington-md",
      "city": "Fort Washington",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "fairland-md",
      "city": "Fairland",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "ilchester-md",
      "city": "Ilchester",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "arnold-md",
      "city": "Arnold",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "landover-md",
      "city": "Landover",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "cockeysville-md",
      "city": "Cockeysville",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "arbutus-md",
      "city": "Arbutus",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "cumberland-md",
      "city": "Cumberland",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "lake-shore-md",
      "city": "Lake Shore",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "green-haven-md",
      "city": "Green Haven",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "rosedale-md",
      "city": "Rosedale",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "camp-springs-md",
      "city": "Camp Springs",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "langley-park-md",
      "city": "Langley Park",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "greater-upper-marlboro-md",
      "city": "Greater Upper Marlboro",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "westminster-md",
      "city": "Westminster",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "hyattsville-md",
      "city": "Hyattsville",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "ballenger-creek-md",
      "city": "Ballenger Creek",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "lanham-seabrook-md",
      "city": "Lanham-seabrook",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "calverton-md",
      "city": "Calverton",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "oxon-hill-md",
      "city": "Oxon Hill",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "takoma-park-md",
      "city": "Takoma Park",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "white-oak-md",
      "city": "White Oak",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "glassmanor-md",
      "city": "Glassmanor",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "seabrook-md",
      "city": "Seabrook",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "redland-md",
      "city": "Redland",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "frankford-md",
      "city": "Frankford",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "beltsville-md",
      "city": "Beltsville",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "ferndale-md",
      "city": "Ferndale",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "easton-md",
      "city": "Easton",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "hillcrest-heights-md",
      "city": "Hillcrest Heights",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "maryland-city-md",
      "city": "Maryland City",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "parole-md",
      "city": "Parole",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "lutherville-timonium-md",
      "city": "Lutherville-timonium",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "elkton-md",
      "city": "Elkton",
      "state": "Maryland",
      "stateCode": "MD"
    },
    {
      "slug": "elkridge-md",
      "city": "Elkridge",
      "state": "Maryland",
      "stateCode": "MD"
    }
  ],
  "MA": [
    {
      "slug": "boston-ma",
      "city": "Boston",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "south-boston-ma",
      "city": "South Boston",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "worcester-ma",
      "city": "Worcester",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "springfield-ma",
      "city": "Springfield",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "lowell-ma",
      "city": "Lowell",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "cambridge-ma",
      "city": "Cambridge",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "new-bedford-ma",
      "city": "New Bedford",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "dorchester-ma",
      "city": "Dorchester",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "brockton-ma",
      "city": "Brockton",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "fall-river-ma",
      "city": "Fall River",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "quincy-ma",
      "city": "Quincy",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "lynn-ma",
      "city": "Lynn",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "newton-ma",
      "city": "Newton",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "somerville-ma",
      "city": "Somerville",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "lawrence-ma",
      "city": "Lawrence",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "framingham-ma",
      "city": "Framingham",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "framingham-center-ma",
      "city": "Framingham Center",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "waltham-ma",
      "city": "Waltham",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "haverhill-ma",
      "city": "Haverhill",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "malden-ma",
      "city": "Malden",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "brookline-ma",
      "city": "Brookline",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "medford-ma",
      "city": "Medford",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "taunton-ma",
      "city": "Taunton",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "chicopee-ma",
      "city": "Chicopee",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "north-chicopee-ma",
      "city": "North Chicopee",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "weymouth-ma",
      "city": "Weymouth",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "revere-ma",
      "city": "Revere",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "peabody-ma",
      "city": "Peabody",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "methuen-ma",
      "city": "Methuen",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "south-peabody-ma",
      "city": "South Peabody",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "barnstable-ma",
      "city": "Barnstable",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "everett-ma",
      "city": "Everett",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "brighton-ma",
      "city": "Brighton",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "attleboro-ma",
      "city": "Attleboro",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "pittsfield-ma",
      "city": "Pittsfield",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "east-boston-ma",
      "city": "East Boston",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "salem-ma",
      "city": "Salem",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "arlington-ma",
      "city": "Arlington",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "westfield-ma",
      "city": "Westfield",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "leominster-ma",
      "city": "Leominster",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "beverly-ma",
      "city": "Beverly",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "holyoke-ma",
      "city": "Holyoke",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "fitchburg-ma",
      "city": "Fitchburg",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "beverly-cove-ma",
      "city": "Beverly Cove",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "billerica-ma",
      "city": "Billerica",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "amherst-ma",
      "city": "Amherst",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "marlborough-ma",
      "city": "Marlborough",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "woburn-ma",
      "city": "Woburn",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "chelsea-ma",
      "city": "Chelsea",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "fenwaykenmore-ma",
      "city": "Fenway/kenmore",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "jamaica-plain-ma",
      "city": "Jamaica Plain",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "braintree-ma",
      "city": "Braintree",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "mattapan-ma",
      "city": "Mattapan",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "chelmsford-ma",
      "city": "Chelmsford",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "shrewsbury-ma",
      "city": "Shrewsbury",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "natick-ma",
      "city": "Natick",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "randolph-ma",
      "city": "Randolph",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "watertown-ma",
      "city": "Watertown",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "hyde-park-ma",
      "city": "Hyde Park",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "lexington-ma",
      "city": "Lexington",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "franklin-ma",
      "city": "Franklin",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "west-roxbury-ma",
      "city": "West Roxbury",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "ashmont-ma",
      "city": "Ashmont",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "gloucester-ma",
      "city": "Gloucester",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "tewksbury-ma",
      "city": "Tewksbury",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "needham-ma",
      "city": "Needham",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "dracut-ma",
      "city": "Dracut",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "allston-ma",
      "city": "Allston",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "agawam-ma",
      "city": "Agawam",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "norwood-ma",
      "city": "Norwood",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "northampton-ma",
      "city": "Northampton",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "north-andover-ma",
      "city": "North Andover",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "melrose-ma",
      "city": "Melrose",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "wellesley-ma",
      "city": "Wellesley",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "west-springfield-ma",
      "city": "West Springfield",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "roslindale-ma",
      "city": "Roslindale",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "milton-ma",
      "city": "Milton",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "stoughton-ma",
      "city": "Stoughton",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "saugus-ma",
      "city": "Saugus",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "danvers-ma",
      "city": "Danvers",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "yarmouth-ma",
      "city": "Yarmouth",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "milford-ma",
      "city": "Milford",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "wakefield-ma",
      "city": "Wakefield",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "reading-ma",
      "city": "Reading",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "belmont-ma",
      "city": "Belmont",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "dedham-ma",
      "city": "Dedham",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "burlington-ma",
      "city": "Burlington",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "chestnut-hill-ma",
      "city": "Chestnut Hill",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "easton-ma",
      "city": "Easton",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "mansfield-ma",
      "city": "Mansfield",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "middleborough-ma",
      "city": "Middleborough",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "wilmington-ma",
      "city": "Wilmington",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "ludlow-ma",
      "city": "Ludlow",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "canton-ma",
      "city": "Canton",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "westford-ma",
      "city": "Westford",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "stoneham-ma",
      "city": "Stoneham",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "winchester-ma",
      "city": "Winchester",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "acton-ma",
      "city": "Acton",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "charlestown-ma",
      "city": "Charlestown",
      "state": "Massachusetts",
      "stateCode": "MA"
    },
    {
      "slug": "gardner-ma",
      "city": "Gardner",
      "state": "Massachusetts",
      "stateCode": "MA"
    }
  ],
  "MI": [
    {
      "slug": "detroit-mi",
      "city": "Detroit",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "grand-rapids-mi",
      "city": "Grand Rapids",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "warren-mi",
      "city": "Warren",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "sterling-heights-mi",
      "city": "Sterling Heights",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "ann-arbor-mi",
      "city": "Ann Arbor",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "lansing-mi",
      "city": "Lansing",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "clinton-township-mi",
      "city": "Clinton Township",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "flint-mi",
      "city": "Flint",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "dearborn-mi",
      "city": "Dearborn",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "livonia-mi",
      "city": "Livonia",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "canton-mi",
      "city": "Canton",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "troy-mi",
      "city": "Troy",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "westland-mi",
      "city": "Westland",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "farmington-hills-mi",
      "city": "Farmington Hills",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "kalamazoo-mi",
      "city": "Kalamazoo",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "waterford-mi",
      "city": "Waterford",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "wyoming-mi",
      "city": "Wyoming",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "shelby-mi",
      "city": "Shelby",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "rochester-hills-mi",
      "city": "Rochester Hills",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "southfield-mi",
      "city": "Southfield",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "west-bloomfield-township-mi",
      "city": "West Bloomfield Township",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "taylor-mi",
      "city": "Taylor",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "pontiac-mi",
      "city": "Pontiac",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "saint-clair-shores-mi",
      "city": "Saint Clair Shores",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "royal-oak-mi",
      "city": "Royal Oak",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "novi-mi",
      "city": "Novi",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "dearborn-heights-mi",
      "city": "Dearborn Heights",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "battle-creek-mi",
      "city": "Battle Creek",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "kentwood-mi",
      "city": "Kentwood",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "redford-mi",
      "city": "Redford",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "saginaw-mi",
      "city": "Saginaw",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "east-lansing-mi",
      "city": "East Lansing",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "portage-mi",
      "city": "Portage",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "roseville-mi",
      "city": "Roseville",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "midland-mi",
      "city": "Midland",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "muskegon-mi",
      "city": "Muskegon",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "lincoln-park-mi",
      "city": "Lincoln Park",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "bay-city-mi",
      "city": "Bay City",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "holland-mi",
      "city": "Holland",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "jackson-mi",
      "city": "Jackson",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "eastpointe-mi",
      "city": "Eastpointe",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "madison-heights-mi",
      "city": "Madison Heights",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "oak-park-mi",
      "city": "Oak Park",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "port-huron-mi",
      "city": "Port Huron",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "southgate-mi",
      "city": "Southgate",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "burton-mi",
      "city": "Burton",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "allen-park-mi",
      "city": "Allen Park",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "garden-city-mi",
      "city": "Garden City",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "mount-pleasant-mi",
      "city": "Mount Pleasant",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "forest-hills-mi",
      "city": "Forest Hills",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "wyandotte-mi",
      "city": "Wyandotte",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "saginaw-township-north-mi",
      "city": "Saginaw Township North",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "inkster-mi",
      "city": "Inkster",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "walker-mi",
      "city": "Walker",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "norton-shores-mi",
      "city": "Norton Shores",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "holt-mi",
      "city": "Holt",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "waverly-mi",
      "city": "Waverly",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "romulus-mi",
      "city": "Romulus",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "auburn-hills-mi",
      "city": "Auburn Hills",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "hamtramck-mi",
      "city": "Hamtramck",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "okemos-mi",
      "city": "Okemos",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "marquette-mi",
      "city": "Marquette",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "birmingham-mi",
      "city": "Birmingham",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "adrian-mi",
      "city": "Adrian",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "ferndale-mi",
      "city": "Ferndale",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "monroe-mi",
      "city": "Monroe",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "ypsilanti-mi",
      "city": "Ypsilanti",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "haslett-mi",
      "city": "Haslett",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "trenton-mi",
      "city": "Trenton",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "allendale-mi",
      "city": "Allendale",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "wayne-mi",
      "city": "Wayne",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "hazel-park-mi",
      "city": "Hazel Park",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "jenison-mi",
      "city": "Jenison",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "mount-clemens-mi",
      "city": "Mount Clemens",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "grandville-mi",
      "city": "Grandville",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "grosse-pointe-woods-mi",
      "city": "Grosse Pointe Woods",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "berkley-mi",
      "city": "Berkley",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "traverse-city-mi",
      "city": "Traverse City",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "acme-mi",
      "city": "Acme",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "ada-mi",
      "city": "Ada",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "addison-mi",
      "city": "Addison",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "afton-mi",
      "city": "Afton",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "ahmeek-mi",
      "city": "Ahmeek",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "akron-mi",
      "city": "Akron",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "alanson-mi",
      "city": "Alanson",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "alba-mi",
      "city": "Alba",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "albion-mi",
      "city": "Albion",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "alden-mi",
      "city": "Alden",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "alger-mi",
      "city": "Alger",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "algonac-mi",
      "city": "Algonac",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "allegan-mi",
      "city": "Allegan",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "allen-mi",
      "city": "Allen",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "allenton-mi",
      "city": "Allenton",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "allouez-mi",
      "city": "Allouez",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "alma-mi",
      "city": "Alma",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "almont-mi",
      "city": "Almont",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "alpena-mi",
      "city": "Alpena",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "alpha-mi",
      "city": "Alpha",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "alto-mi",
      "city": "Alto",
      "state": "Michigan",
      "stateCode": "MI"
    },
    {
      "slug": "amasa-mi",
      "city": "Amasa",
      "state": "Michigan",
      "stateCode": "MI"
    }
  ],
  "MN": [
    {
      "slug": "minneapolis-mn",
      "city": "Minneapolis",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "saint-paul-mn",
      "city": "Saint Paul",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "rochester-mn",
      "city": "Rochester",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "bloomington-mn",
      "city": "Bloomington",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "duluth-mn",
      "city": "Duluth",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "brooklyn-park-mn",
      "city": "Brooklyn Park",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "plymouth-mn",
      "city": "Plymouth",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "maple-grove-mn",
      "city": "Maple Grove",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "woodbury-mn",
      "city": "Woodbury",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "eagan-mn",
      "city": "Eagan",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "saint-cloud-mn",
      "city": "Saint Cloud",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "eden-prairie-mn",
      "city": "Eden Prairie",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "west-coon-rapids-mn",
      "city": "West Coon Rapids",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "coon-rapids-mn",
      "city": "Coon Rapids",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "blaine-mn",
      "city": "Blaine",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "burnsville-mn",
      "city": "Burnsville",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "lakeville-mn",
      "city": "Lakeville",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "minnetonka-mn",
      "city": "Minnetonka",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "apple-valley-mn",
      "city": "Apple Valley",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "edina-mn",
      "city": "Edina",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "minnetonka-mills-mn",
      "city": "Minnetonka Mills",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "saint-louis-park-mn",
      "city": "Saint Louis Park",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "moorhead-mn",
      "city": "Moorhead",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "mankato-mn",
      "city": "Mankato",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "maplewood-mn",
      "city": "Maplewood",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "shakopee-mn",
      "city": "Shakopee",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "richfield-mn",
      "city": "Richfield",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "cottage-grove-mn",
      "city": "Cottage Grove",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "roseville-mn",
      "city": "Roseville",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "inver-grove-heights-mn",
      "city": "Inver Grove Heights",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "andover-mn",
      "city": "Andover",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "brooklyn-center-mn",
      "city": "Brooklyn Center",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "savage-mn",
      "city": "Savage",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "longfellow-community-mn",
      "city": "Longfellow Community",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "oakdale-mn",
      "city": "Oakdale",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "fridley-mn",
      "city": "Fridley",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "winona-mn",
      "city": "Winona",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "shoreview-mn",
      "city": "Shoreview",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "ramsey-mn",
      "city": "Ramsey",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "owatonna-mn",
      "city": "Owatonna",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "chanhassen-mn",
      "city": "Chanhassen",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "prior-lake-mn",
      "city": "Prior Lake",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "white-bear-lake-mn",
      "city": "White Bear Lake",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "chaska-mn",
      "city": "Chaska",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "austin-mn",
      "city": "Austin",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "elk-river-mn",
      "city": "Elk River",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "champlin-mn",
      "city": "Champlin",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "faribault-mn",
      "city": "Faribault",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "rosemount-mn",
      "city": "Rosemount",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "crystal-mn",
      "city": "Crystal",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "farmington-mn",
      "city": "Farmington",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "hastings-mn",
      "city": "Hastings",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "new-brighton-mn",
      "city": "New Brighton",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "golden-valley-mn",
      "city": "Golden Valley",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "lino-lakes-mn",
      "city": "Lino Lakes",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "new-hope-mn",
      "city": "New Hope",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "northfield-mn",
      "city": "Northfield",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "south-saint-paul-mn",
      "city": "South Saint Paul",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "columbia-heights-mn",
      "city": "Columbia Heights",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "willmar-mn",
      "city": "Willmar",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "forest-lake-mn",
      "city": "Forest Lake",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "west-saint-paul-mn",
      "city": "West Saint Paul",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "stillwater-mn",
      "city": "Stillwater",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "albert-lea-mn",
      "city": "Albert Lea",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "hopkins-mn",
      "city": "Hopkins",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "anoka-mn",
      "city": "Anoka",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "sartell-mn",
      "city": "Sartell",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "red-wing-mn",
      "city": "Red Wing",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "saint-michael-mn",
      "city": "Saint Michael",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "hibbing-mn",
      "city": "Hibbing",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "ham-lake-mn",
      "city": "Ham Lake",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "buffalo-mn",
      "city": "Buffalo",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "otsego-mn",
      "city": "Otsego",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "ada-mn",
      "city": "Ada",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "adams-mn",
      "city": "Adams",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "adolph-mn",
      "city": "Adolph",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "adrian-mn",
      "city": "Adrian",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "afton-mn",
      "city": "Afton",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "ah-gwah-ching-mn",
      "city": "Ah Gwah Ching",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "aitkin-mn",
      "city": "Aitkin",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "akeley-mn",
      "city": "Akeley",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "albany-mn",
      "city": "Albany",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "alberta-mn",
      "city": "Alberta",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "albertville-mn",
      "city": "Albertville",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "alborn-mn",
      "city": "Alborn",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "alden-mn",
      "city": "Alden",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "aldrich-mn",
      "city": "Aldrich",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "alexandria-mn",
      "city": "Alexandria",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "almelund-mn",
      "city": "Almelund",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "alpha-mn",
      "city": "Alpha",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "altura-mn",
      "city": "Altura",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "alvarado-mn",
      "city": "Alvarado",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "amboy-mn",
      "city": "Amboy",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "angle-inlet-mn",
      "city": "Angle Inlet",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "angora-mn",
      "city": "Angora",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "angus-mn",
      "city": "Angus",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "annandale-mn",
      "city": "Annandale",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "appleton-mn",
      "city": "Appleton",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "arco-mn",
      "city": "Arco",
      "state": "Minnesota",
      "stateCode": "MN"
    },
    {
      "slug": "argyle-mn",
      "city": "Argyle",
      "state": "Minnesota",
      "stateCode": "MN"
    }
  ],
  "MS": [
    {
      "slug": "jackson-ms",
      "city": "Jackson",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "gulfport-ms",
      "city": "Gulfport",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "west-gulfport-ms",
      "city": "West Gulfport",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "southaven-ms",
      "city": "Southaven",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "hattiesburg-ms",
      "city": "Hattiesburg",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "biloxi-ms",
      "city": "Biloxi",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "meridian-ms",
      "city": "Meridian",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "olive-branch-ms",
      "city": "Olive Branch",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "tupelo-ms",
      "city": "Tupelo",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "greenville-ms",
      "city": "Greenville",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "horn-lake-ms",
      "city": "Horn Lake",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "pearl-ms",
      "city": "Pearl",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "madison-ms",
      "city": "Madison",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "starkville-ms",
      "city": "Starkville",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "clinton-ms",
      "city": "Clinton",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "ridgeland-ms",
      "city": "Ridgeland",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "brandon-ms",
      "city": "Brandon",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "columbus-ms",
      "city": "Columbus",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "vicksburg-ms",
      "city": "Vicksburg",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "oxford-ms",
      "city": "Oxford",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "pascagoula-ms",
      "city": "Pascagoula",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "laurel-ms",
      "city": "Laurel",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "gautier-ms",
      "city": "Gautier",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "ocean-springs-ms",
      "city": "Ocean Springs",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "clarksdale-ms",
      "city": "Clarksdale",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "long-beach-ms",
      "city": "Long Beach",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "hernando-ms",
      "city": "Hernando",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "greenwood-ms",
      "city": "Greenwood",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "natchez-ms",
      "city": "Natchez",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "abbeville-ms",
      "city": "Abbeville",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "aberdeen-ms",
      "city": "Aberdeen",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "ackerman-ms",
      "city": "Ackerman",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "algoma-ms",
      "city": "Algoma",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "alligator-ms",
      "city": "Alligator",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "amory-ms",
      "city": "Amory",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "anguilla-ms",
      "city": "Anguilla",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "arcola-ms",
      "city": "Arcola",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "arkabutla-ms",
      "city": "Arkabutla",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "artesia-ms",
      "city": "Artesia",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "ashland-ms",
      "city": "Ashland",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "avalon-ms",
      "city": "Avalon",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "avon-ms",
      "city": "Avon",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "bailey-ms",
      "city": "Bailey",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "baldwyn-ms",
      "city": "Baldwyn",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "banner-ms",
      "city": "Banner",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "bassfield-ms",
      "city": "Bassfield",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "batesville-ms",
      "city": "Batesville",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "bay-saint-louis-ms",
      "city": "Bay Saint Louis",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "bay-springs-ms",
      "city": "Bay Springs",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "beaumont-ms",
      "city": "Beaumont",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "becker-ms",
      "city": "Becker",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "belden-ms",
      "city": "Belden",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "belen-ms",
      "city": "Belen",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "bellefontaine-ms",
      "city": "Bellefontaine",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "belmont-ms",
      "city": "Belmont",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "belzoni-ms",
      "city": "Belzoni",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "benoit-ms",
      "city": "Benoit",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "benton-ms",
      "city": "Benton",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "bentonia-ms",
      "city": "Bentonia",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "beulah-ms",
      "city": "Beulah",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "big-creek-ms",
      "city": "Big Creek",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "blue-mountain-ms",
      "city": "Blue Mountain",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "blue-springs-ms",
      "city": "Blue Springs",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "bogue-chitto-ms",
      "city": "Bogue Chitto",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "bolton-ms",
      "city": "Bolton",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "booneville-ms",
      "city": "Booneville",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "boyle-ms",
      "city": "Boyle",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "braxton-ms",
      "city": "Braxton",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "brookhaven-ms",
      "city": "Brookhaven",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "brooklyn-ms",
      "city": "Brooklyn",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "brooksville-ms",
      "city": "Brooksville",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "bruce-ms",
      "city": "Bruce",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "buckatunna-ms",
      "city": "Buckatunna",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "bude-ms",
      "city": "Bude",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "burnsville-ms",
      "city": "Burnsville",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "byhalia-ms",
      "city": "Byhalia",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "byram-ms",
      "city": "Byram",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "caledonia-ms",
      "city": "Caledonia",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "calhoun-city-ms",
      "city": "Calhoun City",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "camden-ms",
      "city": "Camden",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "canton-ms",
      "city": "Canton",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "carriere-ms",
      "city": "Carriere",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "carrollton-ms",
      "city": "Carrollton",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "carson-ms",
      "city": "Carson",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "carthage-ms",
      "city": "Carthage",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "cary-ms",
      "city": "Cary",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "cascilla-ms",
      "city": "Cascilla",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "cedarbluff-ms",
      "city": "Cedarbluff",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "centreville-ms",
      "city": "Centreville",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "charleston-ms",
      "city": "Charleston",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "chatawa-ms",
      "city": "Chatawa",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "chatham-ms",
      "city": "Chatham",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "chunky-ms",
      "city": "Chunky",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "clara-ms",
      "city": "Clara",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "cleveland-ms",
      "city": "Cleveland",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "coahoma-ms",
      "city": "Coahoma",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "coffeeville-ms",
      "city": "Coffeeville",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "coila-ms",
      "city": "Coila",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "coldwater-ms",
      "city": "Coldwater",
      "state": "Mississippi",
      "stateCode": "MS"
    },
    {
      "slug": "collins-ms",
      "city": "Collins",
      "state": "Mississippi",
      "stateCode": "MS"
    }
  ],
  "MO": [
    {
      "slug": "kansas-city-mo",
      "city": "Kansas City",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "st-louis-mo",
      "city": "St. Louis",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "springfield-mo",
      "city": "Springfield",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "columbia-mo",
      "city": "Columbia",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "independence-mo",
      "city": "Independence",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "east-independence-mo",
      "city": "East Independence",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "lees-summit-mo",
      "city": "Lee's Summit",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "ofallon-mo",
      "city": "O'fallon",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "saint-joseph-mo",
      "city": "Saint Joseph",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "saint-charles-mo",
      "city": "Saint Charles",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "blue-springs-mo",
      "city": "Blue Springs",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "saint-peters-mo",
      "city": "Saint Peters",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "florissant-mo",
      "city": "Florissant",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "joplin-mo",
      "city": "Joplin",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "chesterfield-mo",
      "city": "Chesterfield",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "jefferson-city-mo",
      "city": "Jefferson City",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "cape-girardeau-mo",
      "city": "Cape Girardeau",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "oakville-mo",
      "city": "Oakville",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "wildwood-mo",
      "city": "Wildwood",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "wentzville-mo",
      "city": "Wentzville",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "university-city-mo",
      "city": "University City",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "ballwin-mo",
      "city": "Ballwin",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "liberty-mo",
      "city": "Liberty",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "raytown-mo",
      "city": "Raytown",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "mehlville-mo",
      "city": "Mehlville",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "kirkwood-mo",
      "city": "Kirkwood",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "maryland-heights-mo",
      "city": "Maryland Heights",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "gladstone-mo",
      "city": "Gladstone",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "hazelwood-mo",
      "city": "Hazelwood",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "grandview-mo",
      "city": "Grandview",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "webster-groves-mo",
      "city": "Webster Groves",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "belton-mo",
      "city": "Belton",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "sedalia-mo",
      "city": "Sedalia",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "arnold-mo",
      "city": "Arnold",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "ferguson-mo",
      "city": "Ferguson",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "nixa-mo",
      "city": "Nixa",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "raymore-mo",
      "city": "Raymore",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "affton-mo",
      "city": "Affton",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "rolla-mo",
      "city": "Rolla",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "warrensburg-mo",
      "city": "Warrensburg",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "spanish-lake-mo",
      "city": "Spanish Lake",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "old-jamestown-mo",
      "city": "Old Jamestown",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "ozark-mo",
      "city": "Ozark",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "creve-coeur-mo",
      "city": "Creve Coeur",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "manchester-mo",
      "city": "Manchester",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "farmington-mo",
      "city": "Farmington",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "hannibal-mo",
      "city": "Hannibal",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "kirksville-mo",
      "city": "Kirksville",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "poplar-bluff-mo",
      "city": "Poplar Bluff",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "lemay-mo",
      "city": "Lemay",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "sikeston-mo",
      "city": "Sikeston",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "concord-mo",
      "city": "Concord",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "republic-mo",
      "city": "Republic",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "overland-mo",
      "city": "Overland",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "clayton-mo",
      "city": "Clayton",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "fort-leonard-wood-mo",
      "city": "Fort Leonard Wood",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "adrian-mo",
      "city": "Adrian",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "advance-mo",
      "city": "Advance",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "agency-mo",
      "city": "Agency",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "alba-mo",
      "city": "Alba",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "albany-mo",
      "city": "Albany",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "aldrich-mo",
      "city": "Aldrich",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "alexandria-mo",
      "city": "Alexandria",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "allendale-mo",
      "city": "Allendale",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "allenton-mo",
      "city": "Allenton",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "alma-mo",
      "city": "Alma",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "altamont-mo",
      "city": "Altamont",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "altenburg-mo",
      "city": "Altenburg",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "alton-mo",
      "city": "Alton",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "amazonia-mo",
      "city": "Amazonia",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "amity-mo",
      "city": "Amity",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "amoret-mo",
      "city": "Amoret",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "amsterdam-mo",
      "city": "Amsterdam",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "anabel-mo",
      "city": "Anabel",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "anderson-mo",
      "city": "Anderson",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "annada-mo",
      "city": "Annada",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "annapolis-mo",
      "city": "Annapolis",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "anniston-mo",
      "city": "Anniston",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "appleton-city-mo",
      "city": "Appleton City",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "arbela-mo",
      "city": "Arbela",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "arbyrd-mo",
      "city": "Arbyrd",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "arcadia-mo",
      "city": "Arcadia",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "archie-mo",
      "city": "Archie",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "arcola-mo",
      "city": "Arcola",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "argyle-mo",
      "city": "Argyle",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "armstrong-mo",
      "city": "Armstrong",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "arrow-rock-mo",
      "city": "Arrow Rock",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "asbury-mo",
      "city": "Asbury",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "ash-grove-mo",
      "city": "Ash Grove",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "ashburn-mo",
      "city": "Ashburn",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "ashland-mo",
      "city": "Ashland",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "atlanta-mo",
      "city": "Atlanta",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "augusta-mo",
      "city": "Augusta",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "aurora-mo",
      "city": "Aurora",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "auxvasse-mo",
      "city": "Auxvasse",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "ava-mo",
      "city": "Ava",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "avilla-mo",
      "city": "Avilla",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "bakersfield-mo",
      "city": "Bakersfield",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "baring-mo",
      "city": "Baring",
      "state": "Missouri",
      "stateCode": "MO"
    },
    {
      "slug": "barnard-mo",
      "city": "Barnard",
      "state": "Missouri",
      "stateCode": "MO"
    }
  ],
  "MT": [
    {
      "slug": "billings-mt",
      "city": "Billings",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "missoula-mt",
      "city": "Missoula",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "great-falls-mt",
      "city": "Great Falls",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "bozeman-mt",
      "city": "Bozeman",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "butte-mt",
      "city": "Butte",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "helena-mt",
      "city": "Helena",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "kalispell-mt",
      "city": "Kalispell",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "absarokee-mt",
      "city": "Absarokee",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "acton-mt",
      "city": "Acton",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "alberton-mt",
      "city": "Alberton",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "alder-mt",
      "city": "Alder",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "alzada-mt",
      "city": "Alzada",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "anaconda-mt",
      "city": "Anaconda",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "angela-mt",
      "city": "Angela",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "antelope-mt",
      "city": "Antelope",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "arlee-mt",
      "city": "Arlee",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "ashland-mt",
      "city": "Ashland",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "augusta-mt",
      "city": "Augusta",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "avon-mt",
      "city": "Avon",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "babb-mt",
      "city": "Babb",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "bainville-mt",
      "city": "Bainville",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "baker-mt",
      "city": "Baker",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "ballantine-mt",
      "city": "Ballantine",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "basin-mt",
      "city": "Basin",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "bearcreek-mt",
      "city": "Bearcreek",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "belfry-mt",
      "city": "Belfry",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "belgrade-mt",
      "city": "Belgrade",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "belt-mt",
      "city": "Belt",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "biddle-mt",
      "city": "Biddle",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "big-arm-mt",
      "city": "Big Arm",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "big-sandy-mt",
      "city": "Big Sandy",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "big-sky-mt",
      "city": "Big Sky",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "big-timber-mt",
      "city": "Big Timber",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "bigfork-mt",
      "city": "Bigfork",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "bighorn-mt",
      "city": "Bighorn",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "birney-mt",
      "city": "Birney",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "black-eagle-mt",
      "city": "Black Eagle",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "bloomfield-mt",
      "city": "Bloomfield",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "bonner-mt",
      "city": "Bonner",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "boulder-mt",
      "city": "Boulder",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "box-elder-mt",
      "city": "Box Elder",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "boyd-mt",
      "city": "Boyd",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "boyes-mt",
      "city": "Boyes",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "brady-mt",
      "city": "Brady",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "bridger-mt",
      "city": "Bridger",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "broadus-mt",
      "city": "Broadus",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "broadview-mt",
      "city": "Broadview",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "brockton-mt",
      "city": "Brockton",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "brockway-mt",
      "city": "Brockway",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "browning-mt",
      "city": "Browning",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "brusett-mt",
      "city": "Brusett",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "buffalo-mt",
      "city": "Buffalo",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "busby-mt",
      "city": "Busby",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "bynum-mt",
      "city": "Bynum",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "cameron-mt",
      "city": "Cameron",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "canyon-creek-mt",
      "city": "Canyon Creek",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "capitol-mt",
      "city": "Capitol",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "cardwell-mt",
      "city": "Cardwell",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "carter-mt",
      "city": "Carter",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "cascade-mt",
      "city": "Cascade",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "charlo-mt",
      "city": "Charlo",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "chester-mt",
      "city": "Chester",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "chinook-mt",
      "city": "Chinook",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "choteau-mt",
      "city": "Choteau",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "circle-mt",
      "city": "Circle",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "clancy-mt",
      "city": "Clancy",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "clinton-mt",
      "city": "Clinton",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "clyde-park-mt",
      "city": "Clyde Park",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "coffee-creek-mt",
      "city": "Coffee Creek",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "cohagen-mt",
      "city": "Cohagen",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "colstrip-mt",
      "city": "Colstrip",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "columbia-falls-mt",
      "city": "Columbia Falls",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "columbus-mt",
      "city": "Columbus",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "condon-mt",
      "city": "Condon",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "conner-mt",
      "city": "Conner",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "conrad-mt",
      "city": "Conrad",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "cooke-city-mt",
      "city": "Cooke City",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "coram-mt",
      "city": "Coram",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "corvallis-mt",
      "city": "Corvallis",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "crane-mt",
      "city": "Crane",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "crow-agency-mt",
      "city": "Crow Agency",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "culbertson-mt",
      "city": "Culbertson",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "custer-mt",
      "city": "Custer",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "cut-bank-mt",
      "city": "Cut Bank",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "dagmar-mt",
      "city": "Dagmar",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "darby-mt",
      "city": "Darby",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "dayton-mt",
      "city": "Dayton",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "de-borgia-mt",
      "city": "De Borgia",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "decker-mt",
      "city": "Decker",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "deer-lodge-mt",
      "city": "Deer Lodge",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "dell-mt",
      "city": "Dell",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "denton-mt",
      "city": "Denton",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "dillon-mt",
      "city": "Dillon",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "divide-mt",
      "city": "Divide",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "dixon-mt",
      "city": "Dixon",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "dodson-mt",
      "city": "Dodson",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "drummond-mt",
      "city": "Drummond",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "dupuyer-mt",
      "city": "Dupuyer",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "dutton-mt",
      "city": "Dutton",
      "state": "Montana",
      "stateCode": "MT"
    },
    {
      "slug": "east-glacier-park-mt",
      "city": "East Glacier Park",
      "state": "Montana",
      "stateCode": "MT"
    }
  ],
  "NE": [
    {
      "slug": "omaha-ne",
      "city": "Omaha",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "lincoln-ne",
      "city": "Lincoln",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bellevue-ne",
      "city": "Bellevue",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "grand-island-ne",
      "city": "Grand Island",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "kearney-ne",
      "city": "Kearney",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "fremont-ne",
      "city": "Fremont",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "hastings-ne",
      "city": "Hastings",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "norfolk-ne",
      "city": "Norfolk",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "north-platte-ne",
      "city": "North Platte",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "columbus-ne",
      "city": "Columbus",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "papillion-ne",
      "city": "Papillion",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "la-vista-ne",
      "city": "La Vista",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "abie-ne",
      "city": "Abie",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "adams-ne",
      "city": "Adams",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "ainsworth-ne",
      "city": "Ainsworth",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "albion-ne",
      "city": "Albion",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "alda-ne",
      "city": "Alda",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "alexandria-ne",
      "city": "Alexandria",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "allen-ne",
      "city": "Allen",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "alliance-ne",
      "city": "Alliance",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "alma-ne",
      "city": "Alma",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "alvo-ne",
      "city": "Alvo",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "amelia-ne",
      "city": "Amelia",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "ames-ne",
      "city": "Ames",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "amherst-ne",
      "city": "Amherst",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "angora-ne",
      "city": "Angora",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "anselmo-ne",
      "city": "Anselmo",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "ansley-ne",
      "city": "Ansley",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "arapahoe-ne",
      "city": "Arapahoe",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "arcadia-ne",
      "city": "Arcadia",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "archer-ne",
      "city": "Archer",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "arlington-ne",
      "city": "Arlington",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "arnold-ne",
      "city": "Arnold",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "arthur-ne",
      "city": "Arthur",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "ashby-ne",
      "city": "Ashby",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "ashland-ne",
      "city": "Ashland",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "ashton-ne",
      "city": "Ashton",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "atkinson-ne",
      "city": "Atkinson",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "atlanta-ne",
      "city": "Atlanta",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "auburn-ne",
      "city": "Auburn",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "aurora-ne",
      "city": "Aurora",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "avoca-ne",
      "city": "Avoca",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "axtell-ne",
      "city": "Axtell",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "ayr-ne",
      "city": "Ayr",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bancroft-ne",
      "city": "Bancroft",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "barneston-ne",
      "city": "Barneston",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bartlett-ne",
      "city": "Bartlett",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bartley-ne",
      "city": "Bartley",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bassett-ne",
      "city": "Bassett",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "battle-creek-ne",
      "city": "Battle Creek",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bayard-ne",
      "city": "Bayard",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "beatrice-ne",
      "city": "Beatrice",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "beaver-city-ne",
      "city": "Beaver City",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "beaver-crossing-ne",
      "city": "Beaver Crossing",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bee-ne",
      "city": "Bee",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "beemer-ne",
      "city": "Beemer",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "belden-ne",
      "city": "Belden",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "belgrade-ne",
      "city": "Belgrade",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bellwood-ne",
      "city": "Bellwood",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "belvidere-ne",
      "city": "Belvidere",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "benedict-ne",
      "city": "Benedict",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "benkelman-ne",
      "city": "Benkelman",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bennet-ne",
      "city": "Bennet",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bennington-ne",
      "city": "Bennington",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bertrand-ne",
      "city": "Bertrand",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "berwyn-ne",
      "city": "Berwyn",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "big-springs-ne",
      "city": "Big Springs",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bingham-ne",
      "city": "Bingham",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bladen-ne",
      "city": "Bladen",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "blair-ne",
      "city": "Blair",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bloomfield-ne",
      "city": "Bloomfield",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bloomington-ne",
      "city": "Bloomington",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "blue-hill-ne",
      "city": "Blue Hill",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "blue-springs-ne",
      "city": "Blue Springs",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "boelus-ne",
      "city": "Boelus",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "boys-town-ne",
      "city": "Boys Town",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bradshaw-ne",
      "city": "Bradshaw",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "brady-ne",
      "city": "Brady",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "brainard-ne",
      "city": "Brainard",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "brewster-ne",
      "city": "Brewster",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bridgeport-ne",
      "city": "Bridgeport",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bristow-ne",
      "city": "Bristow",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "broadwater-ne",
      "city": "Broadwater",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "brock-ne",
      "city": "Brock",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "broken-bow-ne",
      "city": "Broken Bow",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "brownville-ne",
      "city": "Brownville",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "brule-ne",
      "city": "Brule",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bruning-ne",
      "city": "Bruning",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bruno-ne",
      "city": "Bruno",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "brunswick-ne",
      "city": "Brunswick",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "burchard-ne",
      "city": "Burchard",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "burr-ne",
      "city": "Burr",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "burwell-ne",
      "city": "Burwell",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "bushnell-ne",
      "city": "Bushnell",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "butte-ne",
      "city": "Butte",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "byron-ne",
      "city": "Byron",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "cairo-ne",
      "city": "Cairo",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "callaway-ne",
      "city": "Callaway",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "cambridge-ne",
      "city": "Cambridge",
      "state": "Nebraska",
      "stateCode": "NE"
    },
    {
      "slug": "campbell-ne",
      "city": "Campbell",
      "state": "Nebraska",
      "stateCode": "NE"
    }
  ],
  "NV": [
    {
      "slug": "las-vegas-nv",
      "city": "Las Vegas",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "henderson-nv",
      "city": "Henderson",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "reno-nv",
      "city": "Reno",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "north-las-vegas-nv",
      "city": "North Las Vegas",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "paradise-nv",
      "city": "Paradise",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "sunrise-manor-nv",
      "city": "Sunrise Manor",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "spring-valley-nv",
      "city": "Spring Valley",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "enterprise-nv",
      "city": "Enterprise",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "sparks-nv",
      "city": "Sparks",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "carson-city-nv",
      "city": "Carson City",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "whitney-nv",
      "city": "Whitney",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "pahrump-nv",
      "city": "Pahrump",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "winchester-nv",
      "city": "Winchester",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "summerlin-south-nv",
      "city": "Summerlin South",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "elko-nv",
      "city": "Elko",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "fernley-nv",
      "city": "Fernley",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "sun-valley-nv",
      "city": "Sun Valley",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "mesquite-nv",
      "city": "Mesquite",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "boulder-city-nv",
      "city": "Boulder City",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "spanish-springs-nv",
      "city": "Spanish Springs",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "alamo-nv",
      "city": "Alamo",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "amargosa-valley-nv",
      "city": "Amargosa Valley",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "austin-nv",
      "city": "Austin",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "baker-nv",
      "city": "Baker",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "battle-mountain-nv",
      "city": "Battle Mountain",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "beatty-nv",
      "city": "Beatty",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "blue-diamond-nv",
      "city": "Blue Diamond",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "bunkerville-nv",
      "city": "Bunkerville",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "cal-nev-ari-nv",
      "city": "Cal Nev Ari",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "caliente-nv",
      "city": "Caliente",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "carlin-nv",
      "city": "Carlin",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "crescent-valley-nv",
      "city": "Crescent Valley",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "crystal-bay-nv",
      "city": "Crystal Bay",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "dayton-nv",
      "city": "Dayton",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "deeth-nv",
      "city": "Deeth",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "denio-nv",
      "city": "Denio",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "duckwater-nv",
      "city": "Duckwater",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "dyer-nv",
      "city": "Dyer",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "ely-nv",
      "city": "Ely",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "empire-nv",
      "city": "Empire",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "eureka-nv",
      "city": "Eureka",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "fallon-nv",
      "city": "Fallon",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "gabbs-nv",
      "city": "Gabbs",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "gardnerville-nv",
      "city": "Gardnerville",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "genoa-nv",
      "city": "Genoa",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "gerlach-nv",
      "city": "Gerlach",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "glenbrook-nv",
      "city": "Glenbrook",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "golconda-nv",
      "city": "Golconda",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "goldfield-nv",
      "city": "Goldfield",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "halleck-nv",
      "city": "Halleck",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "hawthorne-nv",
      "city": "Hawthorne",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "hiko-nv",
      "city": "Hiko",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "imlay-nv",
      "city": "Imlay",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "incline-village-nv",
      "city": "Incline Village",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "indian-springs-nv",
      "city": "Indian Springs",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "jackpot-nv",
      "city": "Jackpot",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "jarbidge-nv",
      "city": "Jarbidge",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "jean-nv",
      "city": "Jean",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "lamoille-nv",
      "city": "Lamoille",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "laughlin-nv",
      "city": "Laughlin",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "logandale-nv",
      "city": "Logandale",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "lovelock-nv",
      "city": "Lovelock",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "lund-nv",
      "city": "Lund",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "luning-nv",
      "city": "Luning",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "manhattan-nv",
      "city": "Manhattan",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "mc-dermitt-nv",
      "city": "Mc Dermitt",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "mc-gill-nv",
      "city": "Mc Gill",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "mercury-nv",
      "city": "Mercury",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "mina-nv",
      "city": "Mina",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "minden-nv",
      "city": "Minden",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "moapa-nv",
      "city": "Moapa",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "montello-nv",
      "city": "Montello",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "mountain-city-nv",
      "city": "Mountain City",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "nellis-afb-nv",
      "city": "Nellis Afb",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "nixon-nv",
      "city": "Nixon",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "orovada-nv",
      "city": "Orovada",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "overton-nv",
      "city": "Overton",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "owyhee-nv",
      "city": "Owyhee",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "panaca-nv",
      "city": "Panaca",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "paradise-valley-nv",
      "city": "Paradise Valley",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "pioche-nv",
      "city": "Pioche",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "round-mountain-nv",
      "city": "Round Mountain",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "ruby-valley-nv",
      "city": "Ruby Valley",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "ruth-nv",
      "city": "Ruth",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "schurz-nv",
      "city": "Schurz",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "searchlight-nv",
      "city": "Searchlight",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "silver-city-nv",
      "city": "Silver City",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "silver-springs-nv",
      "city": "Silver Springs",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "silverpeak-nv",
      "city": "Silverpeak",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "sloan-nv",
      "city": "Sloan",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "smith-nv",
      "city": "Smith",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "spring-creek-nv",
      "city": "Spring Creek",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "stateline-nv",
      "city": "Stateline",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "the-lakes-nv",
      "city": "The Lakes",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "tonopah-nv",
      "city": "Tonopah",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "tuscarora-nv",
      "city": "Tuscarora",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "valmy-nv",
      "city": "Valmy",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "verdi-nv",
      "city": "Verdi",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "virginia-city-nv",
      "city": "Virginia City",
      "state": "Nevada",
      "stateCode": "NV"
    },
    {
      "slug": "wadsworth-nv",
      "city": "Wadsworth",
      "state": "Nevada",
      "stateCode": "NV"
    }
  ],
  "NH": [
    {
      "slug": "manchester-nh",
      "city": "Manchester",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "nashua-nh",
      "city": "Nashua",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "concord-nh",
      "city": "Concord",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "east-concord-nh",
      "city": "East Concord",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "derry-village-nh",
      "city": "Derry Village",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "dover-nh",
      "city": "Dover",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "rochester-nh",
      "city": "Rochester",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "salem-nh",
      "city": "Salem",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "merrimack-nh",
      "city": "Merrimack",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "keene-nh",
      "city": "Keene",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "derry-nh",
      "city": "Derry",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "portsmouth-nh",
      "city": "Portsmouth",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "bedford-nh",
      "city": "Bedford",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "laconia-nh",
      "city": "Laconia",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "acworth-nh",
      "city": "Acworth",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "alstead-nh",
      "city": "Alstead",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "alton-nh",
      "city": "Alton",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "alton-bay-nh",
      "city": "Alton Bay",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "amherst-nh",
      "city": "Amherst",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "andover-nh",
      "city": "Andover",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "antrim-nh",
      "city": "Antrim",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "ashland-nh",
      "city": "Ashland",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "ashuelot-nh",
      "city": "Ashuelot",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "atkinson-nh",
      "city": "Atkinson",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "auburn-nh",
      "city": "Auburn",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "barnstead-nh",
      "city": "Barnstead",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "barrington-nh",
      "city": "Barrington",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "bartlett-nh",
      "city": "Bartlett",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "bath-nh",
      "city": "Bath",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "belmont-nh",
      "city": "Belmont",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "bennington-nh",
      "city": "Bennington",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "berlin-nh",
      "city": "Berlin",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "bethlehem-nh",
      "city": "Bethlehem",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "bow-nh",
      "city": "Bow",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "bradford-nh",
      "city": "Bradford",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "bretton-woods-nh",
      "city": "Bretton Woods",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "bristol-nh",
      "city": "Bristol",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "brookline-nh",
      "city": "Brookline",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "campton-nh",
      "city": "Campton",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "canaan-nh",
      "city": "Canaan",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "candia-nh",
      "city": "Candia",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "canterbury-nh",
      "city": "Canterbury",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "center-barnstead-nh",
      "city": "Center Barnstead",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "center-conway-nh",
      "city": "Center Conway",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "center-harbor-nh",
      "city": "Center Harbor",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "center-ossipee-nh",
      "city": "Center Ossipee",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "center-sandwich-nh",
      "city": "Center Sandwich",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "center-strafford-nh",
      "city": "Center Strafford",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "center-tuftonboro-nh",
      "city": "Center Tuftonboro",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "charlestown-nh",
      "city": "Charlestown",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "chatham-nh",
      "city": "Chatham",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "chester-nh",
      "city": "Chester",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "chesterfield-nh",
      "city": "Chesterfield",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "chichester-nh",
      "city": "Chichester",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "chocorua-nh",
      "city": "Chocorua",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "claremont-nh",
      "city": "Claremont",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "colebrook-nh",
      "city": "Colebrook",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "contoocook-nh",
      "city": "Contoocook",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "conway-nh",
      "city": "Conway",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "cornish-nh",
      "city": "Cornish",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "cornish-flat-nh",
      "city": "Cornish Flat",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "danbury-nh",
      "city": "Danbury",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "danville-nh",
      "city": "Danville",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "deerfield-nh",
      "city": "Deerfield",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "drewsville-nh",
      "city": "Drewsville",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "dublin-nh",
      "city": "Dublin",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "dunbarton-nh",
      "city": "Dunbarton",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "durham-nh",
      "city": "Durham",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "east-andover-nh",
      "city": "East Andover",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "east-candia-nh",
      "city": "East Candia",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "east-derry-nh",
      "city": "East Derry",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "east-hampstead-nh",
      "city": "East Hampstead",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "east-hebron-nh",
      "city": "East Hebron",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "east-kingston-nh",
      "city": "East Kingston",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "east-wakefield-nh",
      "city": "East Wakefield",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "eaton-center-nh",
      "city": "Eaton Center",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "effingham-nh",
      "city": "Effingham",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "elkins-nh",
      "city": "Elkins",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "enfield-nh",
      "city": "Enfield",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "enfield-center-nh",
      "city": "Enfield Center",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "epping-nh",
      "city": "Epping",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "epsom-nh",
      "city": "Epsom",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "errol-nh",
      "city": "Errol",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "etna-nh",
      "city": "Etna",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "exeter-nh",
      "city": "Exeter",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "farmington-nh",
      "city": "Farmington",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "fitzwilliam-nh",
      "city": "Fitzwilliam",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "francestown-nh",
      "city": "Francestown",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "franconia-nh",
      "city": "Franconia",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "franklin-nh",
      "city": "Franklin",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "freedom-nh",
      "city": "Freedom",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "fremont-nh",
      "city": "Fremont",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "georges-mills-nh",
      "city": "Georges Mills",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "gilford-nh",
      "city": "Gilford",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "gilmanton-nh",
      "city": "Gilmanton",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "gilmanton-iron-works-nh",
      "city": "Gilmanton Iron Works",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "gilsum-nh",
      "city": "Gilsum",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "glen-nh",
      "city": "Glen",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "glencliff-nh",
      "city": "Glencliff",
      "state": "New Hampshire",
      "stateCode": "NH"
    },
    {
      "slug": "goffstown-nh",
      "city": "Goffstown",
      "state": "New Hampshire",
      "stateCode": "NH"
    }
  ],
  "NJ": [
    {
      "slug": "newark-nj",
      "city": "Newark",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "jersey-city-nj",
      "city": "Jersey City",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "paterson-nj",
      "city": "Paterson",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "elizabeth-nj",
      "city": "Elizabeth",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "edison-nj",
      "city": "Edison",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "trenton-nj",
      "city": "Trenton",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "toms-river-nj",
      "city": "Toms River",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "clifton-nj",
      "city": "Clifton",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "camden-nj",
      "city": "Camden",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "brick-nj",
      "city": "Brick",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "passaic-nj",
      "city": "Passaic",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "cherry-hill-nj",
      "city": "Cherry Hill",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "union-city-nj",
      "city": "Union City",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "bayonne-nj",
      "city": "Bayonne",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "middletown-nj",
      "city": "Middletown",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "east-orange-nj",
      "city": "East Orange",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "north-bergen-nj",
      "city": "North Bergen",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "irvington-nj",
      "city": "Irvington",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "vineland-nj",
      "city": "Vineland",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "south-vineland-nj",
      "city": "South Vineland",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "wayne-nj",
      "city": "Wayne",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "new-brunswick-nj",
      "city": "New Brunswick",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "union-nj",
      "city": "Union",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "piscataway-nj",
      "city": "Piscataway",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "jackson-nj",
      "city": "Jackson",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "lakewood-nj",
      "city": "Lakewood",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "hoboken-nj",
      "city": "Hoboken",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "west-new-york-nj",
      "city": "West New York",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "perth-amboy-nj",
      "city": "Perth Amboy",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "plainfield-nj",
      "city": "Plainfield",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "parsippany-nj",
      "city": "Parsippany",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "bloomfield-nj",
      "city": "Bloomfield",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "east-brunswick-nj",
      "city": "East Brunswick",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "west-orange-nj",
      "city": "West Orange",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "sayreville-nj",
      "city": "Sayreville",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "hackensack-nj",
      "city": "Hackensack",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "bridgewater-nj",
      "city": "Bridgewater",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "north-brunswick-nj",
      "city": "North Brunswick",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "sicklerville-nj",
      "city": "Sicklerville",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "sayreville-junction-nj",
      "city": "Sayreville Junction",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "kearny-nj",
      "city": "Kearny",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "linden-nj",
      "city": "Linden",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "mount-laurel-nj",
      "city": "Mount Laurel",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "marlboro-nj",
      "city": "Marlboro",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "teaneck-nj",
      "city": "Teaneck",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "montclair-nj",
      "city": "Montclair",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "atlantic-city-nj",
      "city": "Atlantic City",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "hillsborough-nj",
      "city": "Hillsborough",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "sewell-nj",
      "city": "Sewell",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "belleville-nj",
      "city": "Belleville",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "fort-lee-nj",
      "city": "Fort Lee",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "ewing-nj",
      "city": "Ewing",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "pennsauken-nj",
      "city": "Pennsauken",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "orange-nj",
      "city": "Orange",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "fair-lawn-nj",
      "city": "Fair Lawn",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "garfield-nj",
      "city": "Garfield",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "willingboro-nj",
      "city": "Willingboro",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "long-branch-nj",
      "city": "Long Branch",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "westfield-nj",
      "city": "Westfield",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "princeton-nj",
      "city": "Princeton",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "rahway-nj",
      "city": "Rahway",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "englewood-nj",
      "city": "Englewood",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "millville-nj",
      "city": "Millville",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "livingston-nj",
      "city": "Livingston",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "bergenfield-nj",
      "city": "Bergenfield",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "nutley-nj",
      "city": "Nutley",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "paramus-nj",
      "city": "Paramus",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "west-milford-nj",
      "city": "West Milford",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "mercerville-hamilton-square-nj",
      "city": "Mercerville-hamilton Square",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "randolph-nj",
      "city": "Randolph",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "ridgewood-nj",
      "city": "Ridgewood",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "bridgeton-nj",
      "city": "Bridgeton",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "maplewood-nj",
      "city": "Maplewood",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "cliffside-park-nj",
      "city": "Cliffside Park",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "lodi-nj",
      "city": "Lodi",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "vincentown-nj",
      "city": "Vincentown",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "south-plainfield-nj",
      "city": "South Plainfield",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "carteret-nj",
      "city": "Carteret",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "mahwah-nj",
      "city": "Mahwah",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "old-bridge-nj",
      "city": "Old Bridge",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "scotch-plains-nj",
      "city": "Scotch Plains",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "south-old-bridge-nj",
      "city": "South Old Bridge",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "cranford-nj",
      "city": "Cranford",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "hillside-nj",
      "city": "Hillside",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "north-plainfield-nj",
      "city": "North Plainfield",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "somerset-nj",
      "city": "Somerset",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "summit-nj",
      "city": "Summit",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "roselle-nj",
      "city": "Roselle",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "basking-ridge-nj",
      "city": "Basking Ridge",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "pleasantville-nj",
      "city": "Pleasantville",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "palisades-park-nj",
      "city": "Palisades Park",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "bayville-nj",
      "city": "Bayville",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "elmwood-park-nj",
      "city": "Elmwood Park",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "millburn-nj",
      "city": "Millburn",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "lyndhurst-nj",
      "city": "Lyndhurst",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "sparta-nj",
      "city": "Sparta",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "woodbridge-nj",
      "city": "Woodbridge",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "glassboro-nj",
      "city": "Glassboro",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "secaucus-nj",
      "city": "Secaucus",
      "state": "New Jersey",
      "stateCode": "NJ"
    },
    {
      "slug": "maple-shade-nj",
      "city": "Maple Shade",
      "state": "New Jersey",
      "stateCode": "NJ"
    }
  ],
  "NM": [
    {
      "slug": "albuquerque-nm",
      "city": "Albuquerque",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "las-cruces-nm",
      "city": "Las Cruces",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "enchanted-hills-nm",
      "city": "Enchanted Hills",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "rio-rancho-nm",
      "city": "Rio Rancho",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "santa-fe-nm",
      "city": "Santa Fe",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "roswell-nm",
      "city": "Roswell",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "farmington-nm",
      "city": "Farmington",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "south-valley-nm",
      "city": "South Valley",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "clovis-nm",
      "city": "Clovis",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "hobbs-nm",
      "city": "Hobbs",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "alamogordo-nm",
      "city": "Alamogordo",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "carlsbad-nm",
      "city": "Carlsbad",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "gallup-nm",
      "city": "Gallup",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "sunland-park-nm",
      "city": "Sunland Park",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "los-lunas-nm",
      "city": "Los Lunas",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "abiquiu-nm",
      "city": "Abiquiu",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "alcalde-nm",
      "city": "Alcalde",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "algodones-nm",
      "city": "Algodones",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "alto-nm",
      "city": "Alto",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "amalia-nm",
      "city": "Amalia",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "amistad-nm",
      "city": "Amistad",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "angel-fire-nm",
      "city": "Angel Fire",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "animas-nm",
      "city": "Animas",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "anthony-nm",
      "city": "Anthony",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "anton-chico-nm",
      "city": "Anton Chico",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "aragon-nm",
      "city": "Aragon",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "arenas-valley-nm",
      "city": "Arenas Valley",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "arrey-nm",
      "city": "Arrey",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "arroyo-hondo-nm",
      "city": "Arroyo Hondo",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "arroyo-seco-nm",
      "city": "Arroyo Seco",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "artesia-nm",
      "city": "Artesia",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "aztec-nm",
      "city": "Aztec",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "bard-nm",
      "city": "Bard",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "bayard-nm",
      "city": "Bayard",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "belen-nm",
      "city": "Belen",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "bell-ranch-nm",
      "city": "Bell Ranch",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "bent-nm",
      "city": "Bent",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "berino-nm",
      "city": "Berino",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "bernalillo-nm",
      "city": "Bernalillo",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "blanco-nm",
      "city": "Blanco",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "bloomfield-nm",
      "city": "Bloomfield",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "bluewater-nm",
      "city": "Bluewater",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "bosque-nm",
      "city": "Bosque",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "bosque-farms-nm",
      "city": "Bosque Farms",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "brimhall-nm",
      "city": "Brimhall",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "broadview-nm",
      "city": "Broadview",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "buckhorn-nm",
      "city": "Buckhorn",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "buena-vista-nm",
      "city": "Buena Vista",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "caballo-nm",
      "city": "Caballo",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "canjilon-nm",
      "city": "Canjilon",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cannon-afb-nm",
      "city": "Cannon Afb",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "canones-nm",
      "city": "Canones",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "capitan-nm",
      "city": "Capitan",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "caprock-nm",
      "city": "Caprock",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "capulin-nm",
      "city": "Capulin",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "carrizozo-nm",
      "city": "Carrizozo",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "carson-nm",
      "city": "Carson",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "casa-blanca-nm",
      "city": "Casa Blanca",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "causey-nm",
      "city": "Causey",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cebolla-nm",
      "city": "Cebolla",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cedar-crest-nm",
      "city": "Cedar Crest",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cedarvale-nm",
      "city": "Cedarvale",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cerrillos-nm",
      "city": "Cerrillos",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cerro-nm",
      "city": "Cerro",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "chacon-nm",
      "city": "Chacon",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "chama-nm",
      "city": "Chama",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "chamberino-nm",
      "city": "Chamberino",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "chamisal-nm",
      "city": "Chamisal",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "chaparral-nm",
      "city": "Chaparral",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "chimayo-nm",
      "city": "Chimayo",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "church-rock-nm",
      "city": "Church Rock",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cimarron-nm",
      "city": "Cimarron",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "claunch-nm",
      "city": "Claunch",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "clayton-nm",
      "city": "Clayton",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cleveland-nm",
      "city": "Cleveland",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cliff-nm",
      "city": "Cliff",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "clines-corners-nm",
      "city": "Clines Corners",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cloudcroft-nm",
      "city": "Cloudcroft",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cochiti-lake-nm",
      "city": "Cochiti Lake",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cochiti-pueblo-nm",
      "city": "Cochiti Pueblo",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "columbus-nm",
      "city": "Columbus",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "conchas-dam-nm",
      "city": "Conchas Dam",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "continental-divide-nm",
      "city": "Continental Divide",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cordova-nm",
      "city": "Cordova",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "corona-nm",
      "city": "Corona",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "corrales-nm",
      "city": "Corrales",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "costilla-nm",
      "city": "Costilla",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "counselor-nm",
      "city": "Counselor",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "coyote-nm",
      "city": "Coyote",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "crossroads-nm",
      "city": "Crossroads",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "crownpoint-nm",
      "city": "Crownpoint",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cuba-nm",
      "city": "Cuba",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cubero-nm",
      "city": "Cubero",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "cuervo-nm",
      "city": "Cuervo",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "datil-nm",
      "city": "Datil",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "deming-nm",
      "city": "Deming",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "derry-nm",
      "city": "Derry",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "des-moines-nm",
      "city": "Des Moines",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "dexter-nm",
      "city": "Dexter",
      "state": "New Mexico",
      "stateCode": "NM"
    },
    {
      "slug": "dixon-nm",
      "city": "Dixon",
      "state": "New Mexico",
      "stateCode": "NM"
    }
  ],
  "NY": [
    {
      "slug": "new-york-city-ny",
      "city": "New York City",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "brooklyn-ny",
      "city": "Brooklyn",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "queens-ny",
      "city": "Queens",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "manhattan-ny",
      "city": "Manhattan",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "the-bronx-ny",
      "city": "The Bronx",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "staten-island-ny",
      "city": "Staten Island",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "buffalo-ny",
      "city": "Buffalo",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "upper-west-side-ny",
      "city": "Upper West Side",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "jamaica-ny",
      "city": "Jamaica",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "rochester-ny",
      "city": "Rochester",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "yonkers-ny",
      "city": "Yonkers",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "east-flatbush-ny",
      "city": "East Flatbush",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "east-new-york-ny",
      "city": "East New York",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "washington-heights-ny",
      "city": "Washington Heights",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "astoria-ny",
      "city": "Astoria",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "borough-park-ny",
      "city": "Borough Park",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "syracuse-ny",
      "city": "Syracuse",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "sunset-park-ny",
      "city": "Sunset Park",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "sheepshead-bay-ny",
      "city": "Sheepshead Bay",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "amherst-ny",
      "city": "Amherst",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "harlem-ny",
      "city": "Harlem",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "east-harlem-ny",
      "city": "East Harlem",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "elmhurst-ny",
      "city": "Elmhurst",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "bushwick-ny",
      "city": "Bushwick",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "gravesend-ny",
      "city": "Gravesend",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "corona-ny",
      "city": "Corona",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "albany-ny",
      "city": "Albany",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "richmond-hill-ny",
      "city": "Richmond Hill",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "fordham-ny",
      "city": "Fordham",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "west-albany-ny",
      "city": "West Albany",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "flatbush-ny",
      "city": "Flatbush",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "chinatown-ny",
      "city": "Chinatown",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "canarsie-ny",
      "city": "Canarsie",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "greenburgh-ny",
      "city": "Greenburgh",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "new-rochelle-ny",
      "city": "New Rochelle",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "south-ozone-park-ny",
      "city": "South Ozone Park",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "cheektowaga-ny",
      "city": "Cheektowaga",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "kings-bridge-ny",
      "city": "Kings Bridge",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "brownsville-ny",
      "city": "Brownsville",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "ridgewood-ny",
      "city": "Ridgewood",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "mount-vernon-ny",
      "city": "Mount Vernon",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "forest-hills-ny",
      "city": "Forest Hills",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "jackson-heights-ny",
      "city": "Jackson Heights",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "bayside-ny",
      "city": "Bayside",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "parkchester-ny",
      "city": "Parkchester",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "schenectady-ny",
      "city": "Schenectady",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "park-slope-ny",
      "city": "Park Slope",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "flatlands-ny",
      "city": "Flatlands",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "east-village-ny",
      "city": "East Village",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "utica-ny",
      "city": "Utica",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "financial-district-ny",
      "city": "Financial District",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "brentwood-ny",
      "city": "Brentwood",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "bensonhurst-ny",
      "city": "Bensonhurst",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "coney-island-ny",
      "city": "Coney Island",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "white-plains-ny",
      "city": "White Plains",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "clay-ny",
      "city": "Clay",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "morningside-heights-ny",
      "city": "Morningside Heights",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "hempstead-ny",
      "city": "Hempstead",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "cypress-hills-ny",
      "city": "Cypress Hills",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "ozone-park-ny",
      "city": "Ozone Park",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "briarwood-ny",
      "city": "Briarwood",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "wakefield-ny",
      "city": "Wakefield",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "queens-village-ny",
      "city": "Queens Village",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "levittown-ny",
      "city": "Levittown",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "irondequoit-ny",
      "city": "Irondequoit",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "mott-haven-ny",
      "city": "Mott Haven",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "troy-ny",
      "city": "Troy",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "sunnyside-ny",
      "city": "Sunnyside",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "niagara-falls-ny",
      "city": "Niagara Falls",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "maspeth-ny",
      "city": "Maspeth",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "binghamton-ny",
      "city": "Binghamton",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "hells-kitchen-ny",
      "city": "Hell's Kitchen",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "west-seneca-ny",
      "city": "West Seneca",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "rego-park-ny",
      "city": "Rego Park",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "freeport-ny",
      "city": "Freeport",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "west-babylon-ny",
      "city": "West Babylon",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "henrietta-ny",
      "city": "Henrietta",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "woodside-ny",
      "city": "Woodside",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "hicksville-ny",
      "city": "Hicksville",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "morris-heights-ny",
      "city": "Morris Heights",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "far-rockaway-ny",
      "city": "Far Rockaway",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "kensington-ny",
      "city": "Kensington",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "coram-ny",
      "city": "Coram",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "manhattan-valley-ny",
      "city": "Manhattan Valley",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "east-meadow-ny",
      "city": "East Meadow",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "valley-stream-ny",
      "city": "Valley Stream",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "kew-gardens-hills-ny",
      "city": "Kew Gardens Hills",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "whitestone-ny",
      "city": "Whitestone",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "clifton-park-ny",
      "city": "Clifton Park",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "brighton-ny",
      "city": "Brighton",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "woodhaven-ny",
      "city": "Woodhaven",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "commack-ny",
      "city": "Commack",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "greenpoint-ny",
      "city": "Greenpoint",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "central-islip-ny",
      "city": "Central Islip",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "dyker-heights-ny",
      "city": "Dyker Heights",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "glendale-ny",
      "city": "Glendale",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "throgs-neck-ny",
      "city": "Throgs Neck",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "new-city-ny",
      "city": "New City",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "long-beach-ny",
      "city": "Long Beach",
      "state": "New York",
      "stateCode": "NY"
    },
    {
      "slug": "elmont-ny",
      "city": "Elmont",
      "state": "New York",
      "stateCode": "NY"
    }
  ],
  "NC": [
    {
      "slug": "charlotte-nc",
      "city": "Charlotte",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "raleigh-nc",
      "city": "Raleigh",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "west-raleigh-nc",
      "city": "West Raleigh",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "greensboro-nc",
      "city": "Greensboro",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "durham-nc",
      "city": "Durham",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "winston-salem-nc",
      "city": "Winston-salem",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "fayetteville-nc",
      "city": "Fayetteville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "cary-nc",
      "city": "Cary",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "wilmington-nc",
      "city": "Wilmington",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "high-point-nc",
      "city": "High Point",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "asheville-nc",
      "city": "Asheville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "greenville-nc",
      "city": "Greenville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "concord-nc",
      "city": "Concord",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "gastonia-nc",
      "city": "Gastonia",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "jacksonville-nc",
      "city": "Jacksonville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "chapel-hill-nc",
      "city": "Chapel Hill",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "rocky-mount-nc",
      "city": "Rocky Mount",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "huntersville-nc",
      "city": "Huntersville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "burlington-nc",
      "city": "Burlington",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "wilson-nc",
      "city": "Wilson",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "kannapolis-nc",
      "city": "Kannapolis",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "apex-nc",
      "city": "Apex",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "hickory-nc",
      "city": "Hickory",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "wake-forest-nc",
      "city": "Wake Forest",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "indian-trail-nc",
      "city": "Indian Trail",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "mooresville-nc",
      "city": "Mooresville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "goldsboro-nc",
      "city": "Goldsboro",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "monroe-nc",
      "city": "Monroe",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "salisbury-nc",
      "city": "Salisbury",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "holly-springs-nc",
      "city": "Holly Springs",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "matthews-nc",
      "city": "Matthews",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "new-bern-nc",
      "city": "New Bern",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "fort-bragg-nc",
      "city": "Fort Bragg",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "sanford-nc",
      "city": "Sanford",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "cornelius-nc",
      "city": "Cornelius",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "garner-nc",
      "city": "Garner",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "thomasville-nc",
      "city": "Thomasville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "statesville-nc",
      "city": "Statesville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "asheboro-nc",
      "city": "Asheboro",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "mint-hill-nc",
      "city": "Mint Hill",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "fuquay-varina-nc",
      "city": "Fuquay-varina",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "morrisville-nc",
      "city": "Morrisville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "kernersville-nc",
      "city": "Kernersville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "lumberton-nc",
      "city": "Lumberton",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "kinston-nc",
      "city": "Kinston",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "carrboro-nc",
      "city": "Carrboro",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "havelock-nc",
      "city": "Havelock",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "shelby-nc",
      "city": "Shelby",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "clemmons-nc",
      "city": "Clemmons",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "lexington-nc",
      "city": "Lexington",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "clayton-nc",
      "city": "Clayton",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "boone-nc",
      "city": "Boone",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "elizabeth-city-nc",
      "city": "Elizabeth City",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "leland-nc",
      "city": "Leland",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "lenoir-nc",
      "city": "Lenoir",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "morganton-nc",
      "city": "Morganton",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "hope-mills-nc",
      "city": "Hope Mills",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "albemarle-nc",
      "city": "Albemarle",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "pinehurst-nc",
      "city": "Pinehurst",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "laurinburg-nc",
      "city": "Laurinburg",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "eden-nc",
      "city": "Eden",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "roanoke-rapids-nc",
      "city": "Roanoke Rapids",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "henderson-nc",
      "city": "Henderson",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "stallings-nc",
      "city": "Stallings",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "aberdeen-nc",
      "city": "Aberdeen",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "advance-nc",
      "city": "Advance",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "ahoskie-nc",
      "city": "Ahoskie",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "alamance-nc",
      "city": "Alamance",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "albertson-nc",
      "city": "Albertson",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "alexander-nc",
      "city": "Alexander",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "alexis-nc",
      "city": "Alexis",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "alliance-nc",
      "city": "Alliance",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "almond-nc",
      "city": "Almond",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "altamahaw-nc",
      "city": "Altamahaw",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "andrews-nc",
      "city": "Andrews",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "angier-nc",
      "city": "Angier",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "ansonville-nc",
      "city": "Ansonville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "arapahoe-nc",
      "city": "Arapahoe",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "ararat-nc",
      "city": "Ararat",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "arden-nc",
      "city": "Arden",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "ash-nc",
      "city": "Ash",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "atkinson-nc",
      "city": "Atkinson",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "atlantic-nc",
      "city": "Atlantic",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "atlantic-beach-nc",
      "city": "Atlantic Beach",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "aulander-nc",
      "city": "Aulander",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "aurora-nc",
      "city": "Aurora",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "autryville-nc",
      "city": "Autryville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "avon-nc",
      "city": "Avon",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "ayden-nc",
      "city": "Ayden",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "aydlett-nc",
      "city": "Aydlett",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "badin-nc",
      "city": "Badin",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "bahama-nc",
      "city": "Bahama",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "bailey-nc",
      "city": "Bailey",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "bakersville-nc",
      "city": "Bakersville",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "balsam-nc",
      "city": "Balsam",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "balsam-grove-nc",
      "city": "Balsam Grove",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "banner-elk-nc",
      "city": "Banner Elk",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "barco-nc",
      "city": "Barco",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "barium-springs-nc",
      "city": "Barium Springs",
      "state": "North Carolina",
      "stateCode": "NC"
    },
    {
      "slug": "barnardsville-nc",
      "city": "Barnardsville",
      "state": "North Carolina",
      "stateCode": "NC"
    }
  ],
  "ND": [
    {
      "slug": "fargo-nd",
      "city": "Fargo",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "bismarck-nd",
      "city": "Bismarck",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "grand-forks-nd",
      "city": "Grand Forks",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "minot-nd",
      "city": "Minot",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "west-fargo-nd",
      "city": "West Fargo",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "williston-nd",
      "city": "Williston",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "dickinson-nd",
      "city": "Dickinson",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "mandan-nd",
      "city": "Mandan",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "jamestown-nd",
      "city": "Jamestown",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "abercrombie-nd",
      "city": "Abercrombie",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "absaraka-nd",
      "city": "Absaraka",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "adams-nd",
      "city": "Adams",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "agate-nd",
      "city": "Agate",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "alamo-nd",
      "city": "Alamo",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "alexander-nd",
      "city": "Alexander",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "almont-nd",
      "city": "Almont",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "alsen-nd",
      "city": "Alsen",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "ambrose-nd",
      "city": "Ambrose",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "amenia-nd",
      "city": "Amenia",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "amidon-nd",
      "city": "Amidon",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "anamoose-nd",
      "city": "Anamoose",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "aneta-nd",
      "city": "Aneta",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "antler-nd",
      "city": "Antler",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "ardoch-nd",
      "city": "Ardoch",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "argusville-nd",
      "city": "Argusville",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "arnegard-nd",
      "city": "Arnegard",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "arthur-nd",
      "city": "Arthur",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "arvilla-nd",
      "city": "Arvilla",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "ashley-nd",
      "city": "Ashley",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "ayr-nd",
      "city": "Ayr",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "baldwin-nd",
      "city": "Baldwin",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "balfour-nd",
      "city": "Balfour",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "balta-nd",
      "city": "Balta",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "bantry-nd",
      "city": "Bantry",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "barney-nd",
      "city": "Barney",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "bathgate-nd",
      "city": "Bathgate",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "beach-nd",
      "city": "Beach",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "belcourt-nd",
      "city": "Belcourt",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "belfield-nd",
      "city": "Belfield",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "benedict-nd",
      "city": "Benedict",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "berlin-nd",
      "city": "Berlin",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "berthold-nd",
      "city": "Berthold",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "beulah-nd",
      "city": "Beulah",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "binford-nd",
      "city": "Binford",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "bisbee-nd",
      "city": "Bisbee",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "blanchard-nd",
      "city": "Blanchard",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "bottineau-nd",
      "city": "Bottineau",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "bowbells-nd",
      "city": "Bowbells",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "bowdon-nd",
      "city": "Bowdon",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "bowman-nd",
      "city": "Bowman",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "braddock-nd",
      "city": "Braddock",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "bremen-nd",
      "city": "Bremen",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "brinsmade-nd",
      "city": "Brinsmade",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "brocket-nd",
      "city": "Brocket",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "buchanan-nd",
      "city": "Buchanan",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "buffalo-nd",
      "city": "Buffalo",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "burlington-nd",
      "city": "Burlington",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "butte-nd",
      "city": "Butte",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "buxton-nd",
      "city": "Buxton",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "caledonia-nd",
      "city": "Caledonia",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "calvin-nd",
      "city": "Calvin",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "cando-nd",
      "city": "Cando",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "cannon-ball-nd",
      "city": "Cannon Ball",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "carpio-nd",
      "city": "Carpio",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "carrington-nd",
      "city": "Carrington",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "carson-nd",
      "city": "Carson",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "cartwright-nd",
      "city": "Cartwright",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "casselton-nd",
      "city": "Casselton",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "cathay-nd",
      "city": "Cathay",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "cavalier-nd",
      "city": "Cavalier",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "cayuga-nd",
      "city": "Cayuga",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "center-nd",
      "city": "Center",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "chaffee-nd",
      "city": "Chaffee",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "chaseley-nd",
      "city": "Chaseley",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "christine-nd",
      "city": "Christine",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "churchs-ferry-nd",
      "city": "Churchs Ferry",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "cleveland-nd",
      "city": "Cleveland",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "clifford-nd",
      "city": "Clifford",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "cogswell-nd",
      "city": "Cogswell",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "coleharbor-nd",
      "city": "Coleharbor",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "colfax-nd",
      "city": "Colfax",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "columbus-nd",
      "city": "Columbus",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "cooperstown-nd",
      "city": "Cooperstown",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "courtenay-nd",
      "city": "Courtenay",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "crary-nd",
      "city": "Crary",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "crosby-nd",
      "city": "Crosby",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "crystal-nd",
      "city": "Crystal",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "cummings-nd",
      "city": "Cummings",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "dahlen-nd",
      "city": "Dahlen",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "davenport-nd",
      "city": "Davenport",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "dawson-nd",
      "city": "Dawson",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "dazey-nd",
      "city": "Dazey",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "deering-nd",
      "city": "Deering",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "denhoff-nd",
      "city": "Denhoff",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "des-lacs-nd",
      "city": "Des Lacs",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "devils-lake-nd",
      "city": "Devils Lake",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "dickey-nd",
      "city": "Dickey",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "dodge-nd",
      "city": "Dodge",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "donnybrook-nd",
      "city": "Donnybrook",
      "state": "North Dakota",
      "stateCode": "ND"
    },
    {
      "slug": "douglas-nd",
      "city": "Douglas",
      "state": "North Dakota",
      "stateCode": "ND"
    }
  ],
  "OH": [
    {
      "slug": "columbus-oh",
      "city": "Columbus",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "cleveland-oh",
      "city": "Cleveland",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "cincinnati-oh",
      "city": "Cincinnati",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "toledo-oh",
      "city": "Toledo",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "akron-oh",
      "city": "Akron",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "dayton-oh",
      "city": "Dayton",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "parma-oh",
      "city": "Parma",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "canton-oh",
      "city": "Canton",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "youngstown-oh",
      "city": "Youngstown",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "lorain-oh",
      "city": "Lorain",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "hamilton-oh",
      "city": "Hamilton",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "springfield-oh",
      "city": "Springfield",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "kettering-oh",
      "city": "Kettering",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "elyria-oh",
      "city": "Elyria",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "lakewood-oh",
      "city": "Lakewood",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "cuyahoga-falls-oh",
      "city": "Cuyahoga Falls",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "middletown-oh",
      "city": "Middletown",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "newark-oh",
      "city": "Newark",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "euclid-oh",
      "city": "Euclid",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "mentor-oh",
      "city": "Mentor",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "mansfield-oh",
      "city": "Mansfield",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "beavercreek-oh",
      "city": "Beavercreek",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "dublin-oh",
      "city": "Dublin",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "cleveland-heights-oh",
      "city": "Cleveland Heights",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "strongsville-oh",
      "city": "Strongsville",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "fairfield-oh",
      "city": "Fairfield",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "findlay-oh",
      "city": "Findlay",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "warren-oh",
      "city": "Warren",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "lancaster-oh",
      "city": "Lancaster",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "grove-city-oh",
      "city": "Grove City",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "westerville-oh",
      "city": "Westerville",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "huber-heights-oh",
      "city": "Huber Heights",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "delaware-oh",
      "city": "Delaware",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "lima-oh",
      "city": "Lima",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "reynoldsburg-oh",
      "city": "Reynoldsburg",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "marion-oh",
      "city": "Marion",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "boardman-oh",
      "city": "Boardman",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "upper-arlington-oh",
      "city": "Upper Arlington",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "stow-oh",
      "city": "Stow",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "brunswick-oh",
      "city": "Brunswick",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "gahanna-oh",
      "city": "Gahanna",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "collinwood-oh",
      "city": "Collinwood",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "hilliard-oh",
      "city": "Hilliard",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "fairborn-oh",
      "city": "Fairborn",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "mason-oh",
      "city": "Mason",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "north-ridgeville-oh",
      "city": "North Ridgeville",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "westlake-oh",
      "city": "Westlake",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "massillon-oh",
      "city": "Massillon",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "north-olmsted-oh",
      "city": "North Olmsted",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "bowling-green-oh",
      "city": "Bowling Green",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "north-royalton-oh",
      "city": "North Royalton",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "kent-oh",
      "city": "Kent",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "austintown-oh",
      "city": "Austintown",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "garfield-heights-oh",
      "city": "Garfield Heights",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "shaker-heights-oh",
      "city": "Shaker Heights",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "wooster-oh",
      "city": "Wooster",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "medina-oh",
      "city": "Medina",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "barberton-oh",
      "city": "Barberton",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "xenia-oh",
      "city": "Xenia",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "green-oh",
      "city": "Green",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "troy-oh",
      "city": "Troy",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "zanesville-oh",
      "city": "Zanesville",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "sandusky-oh",
      "city": "Sandusky",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "athens-oh",
      "city": "Athens",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "riverside-oh",
      "city": "Riverside",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "trotwood-oh",
      "city": "Trotwood",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "centerville-oh",
      "city": "Centerville",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "glenville-oh",
      "city": "Glenville",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "avon-lake-oh",
      "city": "Avon Lake",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "solon-oh",
      "city": "Solon",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "marysville-oh",
      "city": "Marysville",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "maple-heights-oh",
      "city": "Maple Heights",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "willoughby-oh",
      "city": "Willoughby",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "avon-oh",
      "city": "Avon",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "hudson-oh",
      "city": "Hudson",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "oxford-oh",
      "city": "Oxford",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "alliance-oh",
      "city": "Alliance",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "wadsworth-oh",
      "city": "Wadsworth",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "south-euclid-oh",
      "city": "South Euclid",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "chillicothe-oh",
      "city": "Chillicothe",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "perrysburg-oh",
      "city": "Perrysburg",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "sidney-oh",
      "city": "Sidney",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "piqua-oh",
      "city": "Piqua",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "lebanon-oh",
      "city": "Lebanon",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "portsmouth-oh",
      "city": "Portsmouth",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "rocky-river-oh",
      "city": "Rocky River",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "ashland-oh",
      "city": "Ashland",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "parma-heights-oh",
      "city": "Parma Heights",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "oregon-oh",
      "city": "Oregon",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "miamisburg-oh",
      "city": "Miamisburg",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "norwood-oh",
      "city": "Norwood",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "painesville-oh",
      "city": "Painesville",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "pickerington-oh",
      "city": "Pickerington",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "broadview-heights-oh",
      "city": "Broadview Heights",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "white-oak-oh",
      "city": "White Oak",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "sylvania-oh",
      "city": "Sylvania",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "berea-oh",
      "city": "Berea",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "twinsburg-oh",
      "city": "Twinsburg",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "mayfield-heights-oh",
      "city": "Mayfield Heights",
      "state": "Ohio",
      "stateCode": "OH"
    },
    {
      "slug": "brook-park-oh",
      "city": "Brook Park",
      "state": "Ohio",
      "stateCode": "OH"
    }
  ],
  "OK": [
    {
      "slug": "oklahoma-city-ok",
      "city": "Oklahoma City",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "tulsa-ok",
      "city": "Tulsa",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "norman-ok",
      "city": "Norman",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "broken-arrow-ok",
      "city": "Broken Arrow",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "lawton-ok",
      "city": "Lawton",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "edmond-ok",
      "city": "Edmond",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "moore-ok",
      "city": "Moore",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "midwest-city-ok",
      "city": "Midwest City",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "enid-ok",
      "city": "Enid",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "stillwater-ok",
      "city": "Stillwater",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "muskogee-ok",
      "city": "Muskogee",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bartlesville-ok",
      "city": "Bartlesville",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "owasso-ok",
      "city": "Owasso",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "shawnee-ok",
      "city": "Shawnee",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "yukon-ok",
      "city": "Yukon",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "ardmore-ok",
      "city": "Ardmore",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "ponca-city-ok",
      "city": "Ponca City",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bixby-ok",
      "city": "Bixby",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "duncan-ok",
      "city": "Duncan",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "del-city-ok",
      "city": "Del City",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "jenks-ok",
      "city": "Jenks",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "sapulpa-ok",
      "city": "Sapulpa",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "mustang-ok",
      "city": "Mustang",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "sand-springs-ok",
      "city": "Sand Springs",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bethany-ok",
      "city": "Bethany",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "altus-ok",
      "city": "Altus",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "claremore-ok",
      "city": "Claremore",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "el-reno-ok",
      "city": "El Reno",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "mcalester-ok",
      "city": "Mcalester",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "ada-ok",
      "city": "Ada",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "durant-ok",
      "city": "Durant",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "tahlequah-ok",
      "city": "Tahlequah",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "chickasha-ok",
      "city": "Chickasha",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "achille-ok",
      "city": "Achille",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "adair-ok",
      "city": "Adair",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "adams-ok",
      "city": "Adams",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "addington-ok",
      "city": "Addington",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "afton-ok",
      "city": "Afton",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "agra-ok",
      "city": "Agra",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "albany-ok",
      "city": "Albany",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "albert-ok",
      "city": "Albert",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "albion-ok",
      "city": "Albion",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "alderson-ok",
      "city": "Alderson",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "alex-ok",
      "city": "Alex",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "aline-ok",
      "city": "Aline",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "allen-ok",
      "city": "Allen",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "altus-afb-ok",
      "city": "Altus Afb",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "alva-ok",
      "city": "Alva",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "amber-ok",
      "city": "Amber",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "ames-ok",
      "city": "Ames",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "amorita-ok",
      "city": "Amorita",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "anadarko-ok",
      "city": "Anadarko",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "antlers-ok",
      "city": "Antlers",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "apache-ok",
      "city": "Apache",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "arapaho-ok",
      "city": "Arapaho",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "arcadia-ok",
      "city": "Arcadia",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "arkoma-ok",
      "city": "Arkoma",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "arnett-ok",
      "city": "Arnett",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "asher-ok",
      "city": "Asher",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "atoka-ok",
      "city": "Atoka",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "atwood-ok",
      "city": "Atwood",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "avant-ok",
      "city": "Avant",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "balko-ok",
      "city": "Balko",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "barnsdall-ok",
      "city": "Barnsdall",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "battiest-ok",
      "city": "Battiest",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "beaver-ok",
      "city": "Beaver",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "beggs-ok",
      "city": "Beggs",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bennington-ok",
      "city": "Bennington",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bessie-ok",
      "city": "Bessie",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bethel-ok",
      "city": "Bethel",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "big-cabin-ok",
      "city": "Big Cabin",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "billings-ok",
      "city": "Billings",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "binger-ok",
      "city": "Binger",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bison-ok",
      "city": "Bison",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "blackwell-ok",
      "city": "Blackwell",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "blair-ok",
      "city": "Blair",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "blanchard-ok",
      "city": "Blanchard",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "blanco-ok",
      "city": "Blanco",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "blocker-ok",
      "city": "Blocker",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bluejacket-ok",
      "city": "Bluejacket",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "boise-city-ok",
      "city": "Boise City",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bokchito-ok",
      "city": "Bokchito",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bokoshe-ok",
      "city": "Bokoshe",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "boley-ok",
      "city": "Boley",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "boswell-ok",
      "city": "Boswell",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bowlegs-ok",
      "city": "Bowlegs",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bowring-ok",
      "city": "Bowring",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "boynton-ok",
      "city": "Boynton",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bradley-ok",
      "city": "Bradley",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "braggs-ok",
      "city": "Braggs",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "braman-ok",
      "city": "Braman",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bray-ok",
      "city": "Bray",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bristow-ok",
      "city": "Bristow",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "broken-bow-ok",
      "city": "Broken Bow",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bromide-ok",
      "city": "Bromide",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "buffalo-ok",
      "city": "Buffalo",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "bunch-ok",
      "city": "Bunch",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "burbank-ok",
      "city": "Burbank",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "burlington-ok",
      "city": "Burlington",
      "state": "Oklahoma",
      "stateCode": "OK"
    },
    {
      "slug": "burneyville-ok",
      "city": "Burneyville",
      "state": "Oklahoma",
      "stateCode": "OK"
    }
  ],
  "OR": [
    {
      "slug": "portland-or",
      "city": "Portland",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "eugene-or",
      "city": "Eugene",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "salem-or",
      "city": "Salem",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "gresham-or",
      "city": "Gresham",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "hillsboro-or",
      "city": "Hillsboro",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "beaverton-or",
      "city": "Beaverton",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "bend-or",
      "city": "Bend",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "medford-or",
      "city": "Medford",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "springfield-or",
      "city": "Springfield",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "corvallis-or",
      "city": "Corvallis",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "albany-or",
      "city": "Albany",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "tigard-or",
      "city": "Tigard",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "aloha-or",
      "city": "Aloha",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "lake-oswego-or",
      "city": "Lake Oswego",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "keizer-or",
      "city": "Keizer",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "grants-pass-or",
      "city": "Grants Pass",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "oregon-city-or",
      "city": "Oregon City",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "mcminnville-or",
      "city": "Mcminnville",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "redmond-or",
      "city": "Redmond",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "tualatin-or",
      "city": "Tualatin",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "west-linn-or",
      "city": "West Linn",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "woodburn-or",
      "city": "Woodburn",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "forest-grove-or",
      "city": "Forest Grove",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "newberg-or",
      "city": "Newberg",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "wilsonville-or",
      "city": "Wilsonville",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "roseburg-or",
      "city": "Roseburg",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "klamath-falls-or",
      "city": "Klamath Falls",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "ashland-or",
      "city": "Ashland",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "milwaukie-or",
      "city": "Milwaukie",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "bethany-or",
      "city": "Bethany",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "lents-or",
      "city": "Lents",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "hayesville-or",
      "city": "Hayesville",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "sherwood-or",
      "city": "Sherwood",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "altamont-or",
      "city": "Altamont",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "happy-valley-or",
      "city": "Happy Valley",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "central-point-or",
      "city": "Central Point",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "canby-or",
      "city": "Canby",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "hermiston-or",
      "city": "Hermiston",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "pendleton-or",
      "city": "Pendleton",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "troutdale-or",
      "city": "Troutdale",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "oak-grove-or",
      "city": "Oak Grove",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "lebanon-or",
      "city": "Lebanon",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "coos-bay-or",
      "city": "Coos Bay",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "four-corners-or",
      "city": "Four Corners",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "the-dalles-or",
      "city": "The Dalles",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "dallas-or",
      "city": "Dallas",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "adams-or",
      "city": "Adams",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "adel-or",
      "city": "Adel",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "adrian-or",
      "city": "Adrian",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "agness-or",
      "city": "Agness",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "allegany-or",
      "city": "Allegany",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "alsea-or",
      "city": "Alsea",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "alvadore-or",
      "city": "Alvadore",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "amity-or",
      "city": "Amity",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "antelope-or",
      "city": "Antelope",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "arch-cape-or",
      "city": "Arch Cape",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "arlington-or",
      "city": "Arlington",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "arock-or",
      "city": "Arock",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "ashwood-or",
      "city": "Ashwood",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "astoria-or",
      "city": "Astoria",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "athena-or",
      "city": "Athena",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "aumsville-or",
      "city": "Aumsville",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "aurora-or",
      "city": "Aurora",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "azalea-or",
      "city": "Azalea",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "baker-city-or",
      "city": "Baker City",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "bandon-or",
      "city": "Bandon",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "banks-or",
      "city": "Banks",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "bates-or",
      "city": "Bates",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "bay-city-or",
      "city": "Bay City",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "beatty-or",
      "city": "Beatty",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "beaver-or",
      "city": "Beaver",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "beavercreek-or",
      "city": "Beavercreek",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "blachly-or",
      "city": "Blachly",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "blodgett-or",
      "city": "Blodgett",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "blue-river-or",
      "city": "Blue River",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "bly-or",
      "city": "Bly",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "boardman-or",
      "city": "Boardman",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "bonanza-or",
      "city": "Bonanza",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "boring-or",
      "city": "Boring",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "bridal-veil-or",
      "city": "Bridal Veil",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "bridgeport-or",
      "city": "Bridgeport",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "brightwood-or",
      "city": "Brightwood",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "broadbent-or",
      "city": "Broadbent",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "brogan-or",
      "city": "Brogan",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "brookings-or",
      "city": "Brookings",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "brothers-or",
      "city": "Brothers",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "brownsville-or",
      "city": "Brownsville",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "burns-or",
      "city": "Burns",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "butte-falls-or",
      "city": "Butte Falls",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "buxton-or",
      "city": "Buxton",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "camas-valley-or",
      "city": "Camas Valley",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "camp-sherman-or",
      "city": "Camp Sherman",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "cannon-beach-or",
      "city": "Cannon Beach",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "canyon-city-or",
      "city": "Canyon City",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "canyonville-or",
      "city": "Canyonville",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "carlton-or",
      "city": "Carlton",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "cascade-locks-or",
      "city": "Cascade Locks",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "cascadia-or",
      "city": "Cascadia",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "cave-junction-or",
      "city": "Cave Junction",
      "state": "Oregon",
      "stateCode": "OR"
    },
    {
      "slug": "cayuse-or",
      "city": "Cayuse",
      "state": "Oregon",
      "stateCode": "OR"
    }
  ],
  "PA": [
    {
      "slug": "philadelphia-pa",
      "city": "Philadelphia",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "pittsburgh-pa",
      "city": "Pittsburgh",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "allentown-pa",
      "city": "Allentown",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "erie-pa",
      "city": "Erie",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "reading-pa",
      "city": "Reading",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "scranton-pa",
      "city": "Scranton",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "bethlehem-pa",
      "city": "Bethlehem",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "bensalem-pa",
      "city": "Bensalem",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "lancaster-pa",
      "city": "Lancaster",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "center-city-pa",
      "city": "Center City",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "abington-pa",
      "city": "Abington",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "levittown-pa",
      "city": "Levittown",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "havertown-pa",
      "city": "Havertown",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "harrisburg-pa",
      "city": "Harrisburg",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "wharton-pa",
      "city": "Wharton",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "whitman-pa",
      "city": "Whitman",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "oxford-circle-pa",
      "city": "Oxford Circle",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "altoona-pa",
      "city": "Altoona",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "penn-hills-pa",
      "city": "Penn Hills",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "york-pa",
      "city": "York",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "state-college-pa",
      "city": "State College",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "wilkes-barre-pa",
      "city": "Wilkes-barre",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "olney-pa",
      "city": "Olney",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "west-oak-lane-pa",
      "city": "West Oak Lane",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "norristown-pa",
      "city": "Norristown",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "chester-pa",
      "city": "Chester",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "cobbs-creek-pa",
      "city": "Cobbs Creek",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "somerton-pa",
      "city": "Somerton",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "mount-lebanon-pa",
      "city": "Mount Lebanon",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "bustleton-pa",
      "city": "Bustleton",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "overbrook-pa",
      "city": "Overbrook",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "bethel-park-pa",
      "city": "Bethel Park",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "wayne-pa",
      "city": "Wayne",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "radnor-pa",
      "city": "Radnor",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "williamsport-pa",
      "city": "Williamsport",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "monroeville-pa",
      "city": "Monroeville",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "cranberry-township-pa",
      "city": "Cranberry Township",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "holmesburg-pa",
      "city": "Holmesburg",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "drexel-hill-pa",
      "city": "Drexel Hill",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "port-richmond-pa",
      "city": "Port Richmond",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "plum-pa",
      "city": "Plum",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "back-mountain-pa",
      "city": "Back Mountain",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "easton-pa",
      "city": "Easton",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "pennsport-pa",
      "city": "Pennsport",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "rhawnhurst-pa",
      "city": "Rhawnhurst",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "lebanon-pa",
      "city": "Lebanon",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "whitehall-township-pa",
      "city": "Whitehall Township",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "hazleton-pa",
      "city": "Hazleton",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "lawndale-pa",
      "city": "Lawndale",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "frankford-pa",
      "city": "Frankford",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "springfield-pa",
      "city": "Springfield",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "pottstown-pa",
      "city": "Pottstown",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "new-castle-pa",
      "city": "New Castle",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "logan-pa",
      "city": "Logan",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "rittenhouse-pa",
      "city": "Rittenhouse",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "allison-park-pa",
      "city": "Allison Park",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "wissinoming-pa",
      "city": "Wissinoming",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "chambersburg-pa",
      "city": "Chambersburg",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "murrysville-pa",
      "city": "Murrysville",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "west-mifflin-pa",
      "city": "West Mifflin",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "haddington-pa",
      "city": "Haddington",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "johnstown-pa",
      "city": "Johnstown",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "king-of-prussia-pa",
      "city": "King Of Prussia",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "west-chester-pa",
      "city": "West Chester",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "baldwin-pa",
      "city": "Baldwin",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "hartranft-pa",
      "city": "Hartranft",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "fox-chase-pa",
      "city": "Fox Chase",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "kingsessing-pa",
      "city": "Kingsessing",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "mckeesport-pa",
      "city": "Mckeesport",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "upper-saint-clair-pa",
      "city": "Upper Saint Clair",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "carlisle-pa",
      "city": "Carlisle",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "east-mount-airy-pa",
      "city": "East Mount Airy",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "limerick-pa",
      "city": "Limerick",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "tacony-pa",
      "city": "Tacony",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "hunting-park-pa",
      "city": "Hunting Park",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "juniata-park-pa",
      "city": "Juniata Park",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "university-city-pa",
      "city": "University City",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "nicetown-tioga-pa",
      "city": "Nicetown-tioga",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "elmwood-pa",
      "city": "Elmwood",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "point-breeze-pa",
      "city": "Point Breeze",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "parkwood-manor-pa",
      "city": "Parkwood Manor",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "phoenixville-pa",
      "city": "Phoenixville",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "lansdale-pa",
      "city": "Lansdale",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "lower-moyamensing-pa",
      "city": "Lower Moyamensing",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "fishtown-pa",
      "city": "Fishtown",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "hermitage-pa",
      "city": "Hermitage",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "strawberry-mansion-pa",
      "city": "Strawberry Mansion",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "wilkinsburg-pa",
      "city": "Wilkinsburg",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "willow-grove-pa",
      "city": "Willow Grove",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "hanover-pa",
      "city": "Hanover",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "aaronsburg-pa",
      "city": "Aaronsburg",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "abbottstown-pa",
      "city": "Abbottstown",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "ackermanville-pa",
      "city": "Ackermanville",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "acme-pa",
      "city": "Acme",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "acosta-pa",
      "city": "Acosta",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "adah-pa",
      "city": "Adah",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "adamsburg-pa",
      "city": "Adamsburg",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "adamstown-pa",
      "city": "Adamstown",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "adamsville-pa",
      "city": "Adamsville",
      "state": "Pennsylvania",
      "stateCode": "PA"
    },
    {
      "slug": "addison-pa",
      "city": "Addison",
      "state": "Pennsylvania",
      "stateCode": "PA"
    }
  ],
  "RI": [
    {
      "slug": "providence-ri",
      "city": "Providence",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "warwick-ri",
      "city": "Warwick",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "cranston-ri",
      "city": "Cranston",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "pawtucket-ri",
      "city": "Pawtucket",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "east-providence-ri",
      "city": "East Providence",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "woonsocket-ri",
      "city": "Woonsocket",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "coventry-ri",
      "city": "Coventry",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "cumberland-ri",
      "city": "Cumberland",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "north-providence-ri",
      "city": "North Providence",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "south-kingstown-ri",
      "city": "South Kingstown",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "west-warwick-ri",
      "city": "West Warwick",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "johnston-ri",
      "city": "Johnston",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "north-kingstown-ri",
      "city": "North Kingstown",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "newport-ri",
      "city": "Newport",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "bristol-ri",
      "city": "Bristol",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "smithfield-ri",
      "city": "Smithfield",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "lincoln-ri",
      "city": "Lincoln",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "central-falls-ri",
      "city": "Central Falls",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "westerly-ri",
      "city": "Westerly",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "portsmouth-ri",
      "city": "Portsmouth",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "middletown-ri",
      "city": "Middletown",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "barrington-ri",
      "city": "Barrington",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "narragansett-ri",
      "city": "Narragansett",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "adamsville-ri",
      "city": "Adamsville",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "albion-ri",
      "city": "Albion",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "ashaway-ri",
      "city": "Ashaway",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "block-island-ri",
      "city": "Block Island",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "bradford-ri",
      "city": "Bradford",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "carolina-ri",
      "city": "Carolina",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "charlestown-ri",
      "city": "Charlestown",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "chepachet-ri",
      "city": "Chepachet",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "clayville-ri",
      "city": "Clayville",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "east-greenwich-ri",
      "city": "East Greenwich",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "exeter-ri",
      "city": "Exeter",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "fiskeville-ri",
      "city": "Fiskeville",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "forestdale-ri",
      "city": "Forestdale",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "foster-ri",
      "city": "Foster",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "glendale-ri",
      "city": "Glendale",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "greene-ri",
      "city": "Greene",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "greenville-ri",
      "city": "Greenville",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "harmony-ri",
      "city": "Harmony",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "harrisville-ri",
      "city": "Harrisville",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "hope-ri",
      "city": "Hope",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "hope-valley-ri",
      "city": "Hope Valley",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "hopkinton-ri",
      "city": "Hopkinton",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "jamestown-ri",
      "city": "Jamestown",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "kenyon-ri",
      "city": "Kenyon",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "kingston-ri",
      "city": "Kingston",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "little-compton-ri",
      "city": "Little Compton",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "manville-ri",
      "city": "Manville",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "mapleville-ri",
      "city": "Mapleville",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "north-scituate-ri",
      "city": "North Scituate",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "north-smithfield-ri",
      "city": "North Smithfield",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "oakland-ri",
      "city": "Oakland",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "pascoag-ri",
      "city": "Pascoag",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "peace-dale-ri",
      "city": "Peace Dale",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "prudence-island-ri",
      "city": "Prudence Island",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "riverside-ri",
      "city": "Riverside",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "rockville-ri",
      "city": "Rockville",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "rumford-ri",
      "city": "Rumford",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "saunderstown-ri",
      "city": "Saunderstown",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "shannock-ri",
      "city": "Shannock",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "slatersville-ri",
      "city": "Slatersville",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "slocum-ri",
      "city": "Slocum",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "tiverton-ri",
      "city": "Tiverton",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "wakefield-ri",
      "city": "Wakefield",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "warren-ri",
      "city": "Warren",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "west-greenwich-ri",
      "city": "West Greenwich",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "west-kingston-ri",
      "city": "West Kingston",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "wood-river-junction-ri",
      "city": "Wood River Junction",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "wyoming-ri",
      "city": "Wyoming",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "adamsville-newport-county-ri",
      "city": "Adamsville (Newport County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "albion-providence-county-ri",
      "city": "Albion (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "ashaway-washington-county-ri",
      "city": "Ashaway (Washington County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "barrington-bristol-county-ri",
      "city": "Barrington (Bristol County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "block-island-washington-county-ri",
      "city": "Block Island (Washington County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "bradford-washington-county-ri",
      "city": "Bradford (Washington County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "bristol-bristol-county-ri",
      "city": "Bristol (Bristol County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "carolina-washington-county-ri",
      "city": "Carolina (Washington County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "central-falls-providence-county-ri",
      "city": "Central Falls (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "charlestown-washington-county-ri",
      "city": "Charlestown (Washington County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "chepachet-providence-county-ri",
      "city": "Chepachet (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "clayville-providence-county-ri",
      "city": "Clayville (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "coventry-kent-county-ri",
      "city": "Coventry (Kent County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "cranston-providence-county-ri",
      "city": "Cranston (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "cumberland-providence-county-ri",
      "city": "Cumberland (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "east-greenwich-kent-county-ri",
      "city": "East Greenwich (Kent County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "east-providence-providence-county-ri",
      "city": "East Providence (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "exeter-washington-county-ri",
      "city": "Exeter (Washington County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "fiskeville-providence-county-ri",
      "city": "Fiskeville (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "forestdale-providence-county-ri",
      "city": "Forestdale (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "foster-providence-county-ri",
      "city": "Foster (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "glendale-providence-county-ri",
      "city": "Glendale (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "greene-kent-county-ri",
      "city": "Greene (Kent County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "greenville-providence-county-ri",
      "city": "Greenville (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "harmony-providence-county-ri",
      "city": "Harmony (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "harrisville-providence-county-ri",
      "city": "Harrisville (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "hope-providence-county-ri",
      "city": "Hope (Providence County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "hope-valley-washington-county-ri",
      "city": "Hope Valley (Washington County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    },
    {
      "slug": "hopkinton-washington-county-ri",
      "city": "Hopkinton (Washington County)",
      "state": "Rhode Island",
      "stateCode": "RI"
    }
  ],
  "SC": [
    {
      "slug": "columbia-sc",
      "city": "Columbia",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "charleston-sc",
      "city": "Charleston",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "north-charleston-sc",
      "city": "North Charleston",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "mount-pleasant-sc",
      "city": "Mount Pleasant",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "rock-hill-sc",
      "city": "Rock Hill",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "greenville-sc",
      "city": "Greenville",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "summerville-sc",
      "city": "Summerville",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "sumter-sc",
      "city": "Sumter",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "goose-creek-sc",
      "city": "Goose Creek",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "hilton-head-island-sc",
      "city": "Hilton Head Island",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "florence-sc",
      "city": "Florence",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "spartanburg-sc",
      "city": "Spartanburg",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "hilton-head-sc",
      "city": "Hilton Head",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "myrtle-beach-sc",
      "city": "Myrtle Beach",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "aiken-sc",
      "city": "Aiken",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "greer-sc",
      "city": "Greer",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "anderson-sc",
      "city": "Anderson",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "mauldin-sc",
      "city": "Mauldin",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "greenwood-sc",
      "city": "Greenwood",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "north-augusta-sc",
      "city": "North Augusta",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "taylors-sc",
      "city": "Taylors",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "saint-andrews-sc",
      "city": "Saint Andrews",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "conway-sc",
      "city": "Conway",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "easley-sc",
      "city": "Easley",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "simpsonville-sc",
      "city": "Simpsonville",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "wade-hampton-sc",
      "city": "Wade Hampton",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "lexington-sc",
      "city": "Lexington",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "socastee-sc",
      "city": "Socastee",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "hanahan-sc",
      "city": "Hanahan",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bluffton-sc",
      "city": "Bluffton",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "west-columbia-sc",
      "city": "West Columbia",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "north-myrtle-beach-sc",
      "city": "North Myrtle Beach",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "clemson-sc",
      "city": "Clemson",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "seven-oaks-sc",
      "city": "Seven Oaks",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "abbeville-sc",
      "city": "Abbeville",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "adams-run-sc",
      "city": "Adams Run",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "alcolu-sc",
      "city": "Alcolu",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "allendale-sc",
      "city": "Allendale",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "andrews-sc",
      "city": "Andrews",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "arcadia-sc",
      "city": "Arcadia",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "awendaw-sc",
      "city": "Awendaw",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "aynor-sc",
      "city": "Aynor",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "ballentine-sc",
      "city": "Ballentine",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bamberg-sc",
      "city": "Bamberg",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "barnwell-sc",
      "city": "Barnwell",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "batesburg-sc",
      "city": "Batesburg",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bath-sc",
      "city": "Bath",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "beaufort-sc",
      "city": "Beaufort",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "beech-island-sc",
      "city": "Beech Island",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "belton-sc",
      "city": "Belton",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bennettsville-sc",
      "city": "Bennettsville",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bethera-sc",
      "city": "Bethera",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bethune-sc",
      "city": "Bethune",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bishopville-sc",
      "city": "Bishopville",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "blacksburg-sc",
      "city": "Blacksburg",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "blackstock-sc",
      "city": "Blackstock",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "blackville-sc",
      "city": "Blackville",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "blair-sc",
      "city": "Blair",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "blenheim-sc",
      "city": "Blenheim",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "blythewood-sc",
      "city": "Blythewood",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "boiling-springs-sc",
      "city": "Boiling Springs",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bonneau-sc",
      "city": "Bonneau",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bowling-green-sc",
      "city": "Bowling Green",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bowman-sc",
      "city": "Bowman",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "bradley-sc",
      "city": "Bradley",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "branchville-sc",
      "city": "Branchville",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "brunson-sc",
      "city": "Brunson",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "buffalo-sc",
      "city": "Buffalo",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "cades-sc",
      "city": "Cades",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "calhoun-falls-sc",
      "city": "Calhoun Falls",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "camden-sc",
      "city": "Camden",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "cameron-sc",
      "city": "Cameron",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "campobello-sc",
      "city": "Campobello",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "canadys-sc",
      "city": "Canadys",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "carlisle-sc",
      "city": "Carlisle",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "cassatt-sc",
      "city": "Cassatt",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "catawba-sc",
      "city": "Catawba",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "cayce-sc",
      "city": "Cayce",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "centenary-sc",
      "city": "Centenary",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "central-sc",
      "city": "Central",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "chapin-sc",
      "city": "Chapin",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "chappells-sc",
      "city": "Chappells",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "charleston-afb-sc",
      "city": "Charleston Afb",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "cheraw-sc",
      "city": "Cheraw",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "chesnee-sc",
      "city": "Chesnee",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "chester-sc",
      "city": "Chester",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "chesterfield-sc",
      "city": "Chesterfield",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "clarks-hill-sc",
      "city": "Clarks Hill",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "clearwater-sc",
      "city": "Clearwater",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "cleveland-sc",
      "city": "Cleveland",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "clifton-sc",
      "city": "Clifton",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "clinton-sc",
      "city": "Clinton",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "clio-sc",
      "city": "Clio",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "clover-sc",
      "city": "Clover",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "conestee-sc",
      "city": "Conestee",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "converse-sc",
      "city": "Converse",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "coosawatchie-sc",
      "city": "Coosawatchie",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "coosawhatchie-sc",
      "city": "Coosawhatchie",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "cope-sc",
      "city": "Cope",
      "state": "South Carolina",
      "stateCode": "SC"
    },
    {
      "slug": "cordesville-sc",
      "city": "Cordesville",
      "state": "South Carolina",
      "stateCode": "SC"
    }
  ],
  "SD": [
    {
      "slug": "sioux-falls-sd",
      "city": "Sioux Falls",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "rapid-city-sd",
      "city": "Rapid City",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "aberdeen-sd",
      "city": "Aberdeen",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "brookings-sd",
      "city": "Brookings",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "watertown-sd",
      "city": "Watertown",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "mitchell-sd",
      "city": "Mitchell",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "agar-sd",
      "city": "Agar",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "akaska-sd",
      "city": "Akaska",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "alcester-sd",
      "city": "Alcester",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "alexandria-sd",
      "city": "Alexandria",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "allen-sd",
      "city": "Allen",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "alpena-sd",
      "city": "Alpena",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "amherst-sd",
      "city": "Amherst",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "andover-sd",
      "city": "Andover",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "arlington-sd",
      "city": "Arlington",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "armour-sd",
      "city": "Armour",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "artesian-sd",
      "city": "Artesian",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "ashton-sd",
      "city": "Ashton",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "astoria-sd",
      "city": "Astoria",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "aurora-sd",
      "city": "Aurora",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "avon-sd",
      "city": "Avon",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "badger-sd",
      "city": "Badger",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "baltic-sd",
      "city": "Baltic",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "barnard-sd",
      "city": "Barnard",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "batesland-sd",
      "city": "Batesland",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "bath-sd",
      "city": "Bath",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "belle-fourche-sd",
      "city": "Belle Fourche",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "belvidere-sd",
      "city": "Belvidere",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "beresford-sd",
      "city": "Beresford",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "big-stone-city-sd",
      "city": "Big Stone City",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "bison-sd",
      "city": "Bison",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "black-hawk-sd",
      "city": "Black Hawk",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "blunt-sd",
      "city": "Blunt",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "bonesteel-sd",
      "city": "Bonesteel",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "bowdle-sd",
      "city": "Bowdle",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "box-elder-sd",
      "city": "Box Elder",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "bradley-sd",
      "city": "Bradley",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "brandon-sd",
      "city": "Brandon",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "brandt-sd",
      "city": "Brandt",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "brentford-sd",
      "city": "Brentford",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "bridgewater-sd",
      "city": "Bridgewater",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "bristol-sd",
      "city": "Bristol",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "britton-sd",
      "city": "Britton",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "bruce-sd",
      "city": "Bruce",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "bryant-sd",
      "city": "Bryant",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "buffalo-sd",
      "city": "Buffalo",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "buffalo-gap-sd",
      "city": "Buffalo Gap",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "buffalo-ridge-sd",
      "city": "Buffalo Ridge",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "bullhead-sd",
      "city": "Bullhead",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "burbank-sd",
      "city": "Burbank",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "burke-sd",
      "city": "Burke",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "camp-crook-sd",
      "city": "Camp Crook",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "canistota-sd",
      "city": "Canistota",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "canova-sd",
      "city": "Canova",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "canton-sd",
      "city": "Canton",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "caputa-sd",
      "city": "Caputa",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "carpenter-sd",
      "city": "Carpenter",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "carter-sd",
      "city": "Carter",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "carthage-sd",
      "city": "Carthage",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "castlewood-sd",
      "city": "Castlewood",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "cavour-sd",
      "city": "Cavour",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "centerville-sd",
      "city": "Centerville",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "chamberlain-sd",
      "city": "Chamberlain",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "chancellor-sd",
      "city": "Chancellor",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "cherry-creek-sd",
      "city": "Cherry Creek",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "chester-sd",
      "city": "Chester",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "claire-city-sd",
      "city": "Claire City",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "claremont-sd",
      "city": "Claremont",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "clark-sd",
      "city": "Clark",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "clear-lake-sd",
      "city": "Clear Lake",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "colman-sd",
      "city": "Colman",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "colome-sd",
      "city": "Colome",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "colton-sd",
      "city": "Colton",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "columbia-sd",
      "city": "Columbia",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "conde-sd",
      "city": "Conde",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "corona-sd",
      "city": "Corona",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "corsica-sd",
      "city": "Corsica",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "creighton-sd",
      "city": "Creighton",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "cresbard-sd",
      "city": "Cresbard",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "crooks-sd",
      "city": "Crooks",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "custer-sd",
      "city": "Custer",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "dallas-sd",
      "city": "Dallas",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "dante-sd",
      "city": "Dante",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "davis-sd",
      "city": "Davis",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "de-smet-sd",
      "city": "De Smet",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "deadwood-sd",
      "city": "Deadwood",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "dell-rapids-sd",
      "city": "Dell Rapids",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "delmont-sd",
      "city": "Delmont",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "dimock-sd",
      "city": "Dimock",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "doland-sd",
      "city": "Doland",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "draper-sd",
      "city": "Draper",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "dupree-sd",
      "city": "Dupree",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "eagle-butte-sd",
      "city": "Eagle Butte",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "eden-sd",
      "city": "Eden",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "edgemont-sd",
      "city": "Edgemont",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "egan-sd",
      "city": "Egan",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "elk-point-sd",
      "city": "Elk Point",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "elkton-sd",
      "city": "Elkton",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "ellsworth-afb-sd",
      "city": "Ellsworth Afb",
      "state": "South Dakota",
      "stateCode": "SD"
    },
    {
      "slug": "elm-springs-sd",
      "city": "Elm Springs",
      "state": "South Dakota",
      "stateCode": "SD"
    }
  ],
  "TN": [
    {
      "slug": "nashville-tn",
      "city": "Nashville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "new-south-memphis-tn",
      "city": "New South Memphis",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "memphis-tn",
      "city": "Memphis",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "knoxville-tn",
      "city": "Knoxville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "chattanooga-tn",
      "city": "Chattanooga",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "clarksville-tn",
      "city": "Clarksville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "murfreesboro-tn",
      "city": "Murfreesboro",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "east-chattanooga-tn",
      "city": "East Chattanooga",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "franklin-tn",
      "city": "Franklin",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "cordova-tn",
      "city": "Cordova",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "jackson-tn",
      "city": "Jackson",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "johnson-city-tn",
      "city": "Johnson City",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bartlett-tn",
      "city": "Bartlett",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "hendersonville-tn",
      "city": "Hendersonville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "kingsport-tn",
      "city": "Kingsport",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "collierville-tn",
      "city": "Collierville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "smyrna-tn",
      "city": "Smyrna",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "cleveland-tn",
      "city": "Cleveland",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "brentwood-tn",
      "city": "Brentwood",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "germantown-tn",
      "city": "Germantown",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "hermitage-tn",
      "city": "Hermitage",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "columbia-tn",
      "city": "Columbia",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "spring-hill-tn",
      "city": "Spring Hill",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "la-vergne-tn",
      "city": "La Vergne",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "gallatin-tn",
      "city": "Gallatin",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "cookeville-tn",
      "city": "Cookeville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "mount-juliet-tn",
      "city": "Mount Juliet",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "brentwood-estates-tn",
      "city": "Brentwood Estates",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "lebanon-tn",
      "city": "Lebanon",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "morristown-tn",
      "city": "Morristown",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "oak-ridge-tn",
      "city": "Oak Ridge",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "maryville-tn",
      "city": "Maryville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bristol-tn",
      "city": "Bristol",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "ellendale-tn",
      "city": "Ellendale",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "farragut-tn",
      "city": "Farragut",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "shelbyville-tn",
      "city": "Shelbyville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "east-ridge-tn",
      "city": "East Ridge",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "tullahoma-tn",
      "city": "Tullahoma",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "goodlettsville-tn",
      "city": "Goodlettsville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "springfield-tn",
      "city": "Springfield",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "dyersburg-tn",
      "city": "Dyersburg",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "sevierville-tn",
      "city": "Sevierville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "dickson-tn",
      "city": "Dickson",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "east-brainerd-tn",
      "city": "East Brainerd",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "greeneville-tn",
      "city": "Greeneville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "adams-tn",
      "city": "Adams",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "adamsville-tn",
      "city": "Adamsville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "afton-tn",
      "city": "Afton",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "alamo-tn",
      "city": "Alamo",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "alcoa-tn",
      "city": "Alcoa",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "alexandria-tn",
      "city": "Alexandria",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "allardt-tn",
      "city": "Allardt",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "allons-tn",
      "city": "Allons",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "allred-tn",
      "city": "Allred",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "alpine-tn",
      "city": "Alpine",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "altamont-tn",
      "city": "Altamont",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "andersonville-tn",
      "city": "Andersonville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "antioch-tn",
      "city": "Antioch",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "apison-tn",
      "city": "Apison",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "ardmore-tn",
      "city": "Ardmore",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "arlington-tn",
      "city": "Arlington",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "arnold-a-f-b-tn",
      "city": "Arnold A F B",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "arnold-afb-tn",
      "city": "Arnold Afb",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "arrington-tn",
      "city": "Arrington",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "arthur-tn",
      "city": "Arthur",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "ashland-city-tn",
      "city": "Ashland City",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "athens-tn",
      "city": "Athens",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "atoka-tn",
      "city": "Atoka",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "atwood-tn",
      "city": "Atwood",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "auburntown-tn",
      "city": "Auburntown",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bakewell-tn",
      "city": "Bakewell",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bath-springs-tn",
      "city": "Bath Springs",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "baxter-tn",
      "city": "Baxter",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bean-station-tn",
      "city": "Bean Station",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "beech-bluff-tn",
      "city": "Beech Bluff",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "beechgrove-tn",
      "city": "Beechgrove",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "beersheba-springs-tn",
      "city": "Beersheba Springs",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "belfast-tn",
      "city": "Belfast",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bell-buckle-tn",
      "city": "Bell Buckle",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bells-tn",
      "city": "Bells",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "belvidere-tn",
      "city": "Belvidere",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "benton-tn",
      "city": "Benton",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bethel-springs-tn",
      "city": "Bethel Springs",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bethpage-tn",
      "city": "Bethpage",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "big-rock-tn",
      "city": "Big Rock",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "big-sandy-tn",
      "city": "Big Sandy",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "birchwood-tn",
      "city": "Birchwood",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "blaine-tn",
      "city": "Blaine",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bloomington-springs-tn",
      "city": "Bloomington Springs",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "blountville-tn",
      "city": "Blountville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bluff-city-tn",
      "city": "Bluff City",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bogota-tn",
      "city": "Bogota",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bolivar-tn",
      "city": "Bolivar",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bon-aqua-tn",
      "city": "Bon Aqua",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "braden-tn",
      "city": "Braden",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bradford-tn",
      "city": "Bradford",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "bradyville-tn",
      "city": "Bradyville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "briceville-tn",
      "city": "Briceville",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "brighton-tn",
      "city": "Brighton",
      "state": "Tennessee",
      "stateCode": "TN"
    },
    {
      "slug": "brownsville-tn",
      "city": "Brownsville",
      "state": "Tennessee",
      "stateCode": "TN"
    }
  ],
  "TX": [
    {
      "slug": "houston-tx",
      "city": "Houston",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "san-antonio-tx",
      "city": "San Antonio",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "dallas-tx",
      "city": "Dallas",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "fort-worth-tx",
      "city": "Fort Worth",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "austin-tx",
      "city": "Austin",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "el-paso-tx",
      "city": "El Paso",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "arlington-tx",
      "city": "Arlington",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "corpus-christi-tx",
      "city": "Corpus Christi",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "plano-tx",
      "city": "Plano",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "laredo-tx",
      "city": "Laredo",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "lubbock-tx",
      "city": "Lubbock",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "garland-tx",
      "city": "Garland",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "irving-tx",
      "city": "Irving",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "cypress-tx",
      "city": "Cypress",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "amarillo-tx",
      "city": "Amarillo",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "grand-prairie-tx",
      "city": "Grand Prairie",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "brownsville-tx",
      "city": "Brownsville",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "mckinney-tx",
      "city": "Mckinney",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "frisco-tx",
      "city": "Frisco",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "pasadena-tx",
      "city": "Pasadena",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "mesquite-tx",
      "city": "Mesquite",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "killeen-tx",
      "city": "Killeen",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "mcallen-tx",
      "city": "Mcallen",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "carrollton-tx",
      "city": "Carrollton",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "midland-tx",
      "city": "Midland",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "waco-tx",
      "city": "Waco",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "denton-tx",
      "city": "Denton",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "abilene-tx",
      "city": "Abilene",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "round-rock-tx",
      "city": "Round Rock",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "beaumont-tx",
      "city": "Beaumont",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "odessa-tx",
      "city": "Odessa",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "richardson-tx",
      "city": "Richardson",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "pearland-tx",
      "city": "Pearland",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "college-station-tx",
      "city": "College Station",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "wichita-falls-tx",
      "city": "Wichita Falls",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "lewisville-tx",
      "city": "Lewisville",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "tyler-tx",
      "city": "Tyler",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "san-angelo-tx",
      "city": "San Angelo",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "alief-tx",
      "city": "Alief",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "league-city-tx",
      "city": "League City",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "allen-tx",
      "city": "Allen",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "the-woodlands-tx",
      "city": "The Woodlands",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "sugar-land-tx",
      "city": "Sugar Land",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "edinburg-tx",
      "city": "Edinburg",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "mission-tx",
      "city": "Mission",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "longview-tx",
      "city": "Longview",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "bryan-tx",
      "city": "Bryan",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "pharr-tx",
      "city": "Pharr",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "baytown-tx",
      "city": "Baytown",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "missouri-city-tx",
      "city": "Missouri City",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "temple-tx",
      "city": "Temple",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "flower-mound-tx",
      "city": "Flower Mound",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "new-braunfels-tx",
      "city": "New Braunfels",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "north-richland-hills-tx",
      "city": "North Richland Hills",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "conroe-tx",
      "city": "Conroe",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "victoria-tx",
      "city": "Victoria",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "cedar-park-tx",
      "city": "Cedar Park",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "atascocita-tx",
      "city": "Atascocita",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "harlingen-tx",
      "city": "Harlingen",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "mansfield-tx",
      "city": "Mansfield",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "georgetown-tx",
      "city": "Georgetown",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "san-marcos-tx",
      "city": "San Marcos",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "rowlett-tx",
      "city": "Rowlett",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "leander-tx",
      "city": "Leander",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "pflugerville-tx",
      "city": "Pflugerville",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "port-arthur-tx",
      "city": "Port Arthur",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "spring-tx",
      "city": "Spring",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "euless-tx",
      "city": "Euless",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "university-of-texas-tx",
      "city": "University Of Texas",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "desoto-tx",
      "city": "Desoto",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "grapevine-tx",
      "city": "Grapevine",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "the-trails-of-frisco-tx",
      "city": "The Trails Of Frisco",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "galveston-tx",
      "city": "Galveston",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "bedford-tx",
      "city": "Bedford",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "cedar-hill-tx",
      "city": "Cedar Hill",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "texas-city-tx",
      "city": "Texas City",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "wylie-tx",
      "city": "Wylie",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "keller-tx",
      "city": "Keller",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "haltom-city-tx",
      "city": "Haltom City",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "burleson-tx",
      "city": "Burleson",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "schertz-tx",
      "city": "Schertz",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "rockwall-tx",
      "city": "Rockwall",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "the-colony-tx",
      "city": "The Colony",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "coppell-tx",
      "city": "Coppell",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "huntsville-tx",
      "city": "Huntsville",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "sherman-tx",
      "city": "Sherman",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "duncanville-tx",
      "city": "Duncanville",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "weslaco-tx",
      "city": "Weslaco",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "hurst-tx",
      "city": "Hurst",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "lancaster-tx",
      "city": "Lancaster",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "friendswood-tx",
      "city": "Friendswood",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "little-elm-tx",
      "city": "Little Elm",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "channelview-tx",
      "city": "Channelview",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "texarkana-tx",
      "city": "Texarkana",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "san-juan-tx",
      "city": "San Juan",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "mission-bend-tx",
      "city": "Mission Bend",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "lufkin-tx",
      "city": "Lufkin",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "del-rio-tx",
      "city": "Del Rio",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "kyle-tx",
      "city": "Kyle",
      "state": "Texas",
      "stateCode": "TX"
    },
    {
      "slug": "rosenberg-tx",
      "city": "Rosenberg",
      "state": "Texas",
      "stateCode": "TX"
    }
  ],
  "UT": [
    {
      "slug": "salt-lake-city-ut",
      "city": "Salt Lake City",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "west-valley-city-ut",
      "city": "West Valley City",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "provo-ut",
      "city": "Provo",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "west-jordan-ut",
      "city": "West Jordan",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "orem-ut",
      "city": "Orem",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "sandy-hills-ut",
      "city": "Sandy Hills",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "sandy-ut",
      "city": "Sandy",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "ogden-ut",
      "city": "Ogden",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "layton-ut",
      "city": "Layton",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "saint-george-ut",
      "city": "Saint George",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "south-jordan-ut",
      "city": "South Jordan",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "millcreek-ut",
      "city": "Millcreek",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "taylorsville-ut",
      "city": "Taylorsville",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "lehi-ut",
      "city": "Lehi",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "logan-ut",
      "city": "Logan",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "murray-ut",
      "city": "Murray",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "draper-ut",
      "city": "Draper",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "bountiful-ut",
      "city": "Bountiful",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "riverton-ut",
      "city": "Riverton",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "pleasant-grove-ut",
      "city": "Pleasant Grove",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "roy-ut",
      "city": "Roy",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "spanish-fork-ut",
      "city": "Spanish Fork",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "south-jordan-heights-ut",
      "city": "South Jordan Heights",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "kearns-ut",
      "city": "Kearns",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "cottonwood-heights-ut",
      "city": "Cottonwood Heights",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "tooele-ut",
      "city": "Tooele",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "midvale-ut",
      "city": "Midvale",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "springville-ut",
      "city": "Springville",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "holladay-ut",
      "city": "Holladay",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "herriman-ut",
      "city": "Herriman",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "clearfield-ut",
      "city": "Clearfield",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "kaysville-ut",
      "city": "Kaysville",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "cedar-city-ut",
      "city": "Cedar City",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "american-fork-ut",
      "city": "American Fork",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "syracuse-ut",
      "city": "Syracuse",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "eagle-mountain-ut",
      "city": "Eagle Mountain",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "magna-ut",
      "city": "Magna",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "saratoga-springs-ut",
      "city": "Saratoga Springs",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "south-salt-lake-ut",
      "city": "South Salt Lake",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "washington-ut",
      "city": "Washington",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "farmington-ut",
      "city": "Farmington",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "clinton-ut",
      "city": "Clinton",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "east-millcreek-ut",
      "city": "East Millcreek",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "north-salt-lake-ut",
      "city": "North Salt Lake",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "payson-ut",
      "city": "Payson",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "brigham-city-ut",
      "city": "Brigham City",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "north-ogden-ut",
      "city": "North Ogden",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "highland-ut",
      "city": "Highland",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "south-ogden-ut",
      "city": "South Ogden",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "centerville-ut",
      "city": "Centerville",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "hurricane-ut",
      "city": "Hurricane",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "alpine-ut",
      "city": "Alpine",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "altamont-ut",
      "city": "Altamont",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "alton-ut",
      "city": "Alton",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "altonah-ut",
      "city": "Altonah",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "aneth-ut",
      "city": "Aneth",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "annabella-ut",
      "city": "Annabella",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "antimony-ut",
      "city": "Antimony",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "aurora-ut",
      "city": "Aurora",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "axtell-ut",
      "city": "Axtell",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "bear-river-city-ut",
      "city": "Bear River City",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "beaver-ut",
      "city": "Beaver",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "beryl-ut",
      "city": "Beryl",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "bicknell-ut",
      "city": "Bicknell",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "bingham-canyon-ut",
      "city": "Bingham Canyon",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "blanding-ut",
      "city": "Blanding",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "bluebell-ut",
      "city": "Bluebell",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "bluff-ut",
      "city": "Bluff",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "bonanza-ut",
      "city": "Bonanza",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "boulder-ut",
      "city": "Boulder",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "brian-head-ut",
      "city": "Brian Head",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "bryce-ut",
      "city": "Bryce",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "bryce-canyon-ut",
      "city": "Bryce Canyon",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "cache-junction-ut",
      "city": "Cache Junction",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "cannonville-ut",
      "city": "Cannonville",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "castle-dale-ut",
      "city": "Castle Dale",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "cedar-valley-ut",
      "city": "Cedar Valley",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "centerfield-ut",
      "city": "Centerfield",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "central-ut",
      "city": "Central",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "chester-ut",
      "city": "Chester",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "circleville-ut",
      "city": "Circleville",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "cisco-ut",
      "city": "Cisco",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "clarkston-ut",
      "city": "Clarkston",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "clawson-ut",
      "city": "Clawson",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "cleveland-ut",
      "city": "Cleveland",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "coalville-ut",
      "city": "Coalville",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "collinston-ut",
      "city": "Collinston",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "corinne-ut",
      "city": "Corinne",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "cornish-ut",
      "city": "Cornish",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "croydon-ut",
      "city": "Croydon",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "dammeron-valley-ut",
      "city": "Dammeron Valley",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "delta-ut",
      "city": "Delta",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "deweyville-ut",
      "city": "Deweyville",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "duchesne-ut",
      "city": "Duchesne",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "duck-creek-village-ut",
      "city": "Duck Creek Village",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "dugway-ut",
      "city": "Dugway",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "dutch-john-ut",
      "city": "Dutch John",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "east-carbon-ut",
      "city": "East Carbon",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "echo-ut",
      "city": "Echo",
      "state": "Utah",
      "stateCode": "UT"
    },
    {
      "slug": "eden-ut",
      "city": "Eden",
      "state": "Utah",
      "stateCode": "UT"
    }
  ],
  "VT": [
    {
      "slug": "burlington-vt",
      "city": "Burlington",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "south-burlington-vt",
      "city": "South Burlington",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "colchester-vt",
      "city": "Colchester",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "rutland-vt",
      "city": "Rutland",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "adamant-vt",
      "city": "Adamant",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "albany-vt",
      "city": "Albany",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "alburg-vt",
      "city": "Alburg",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "alburgh-vt",
      "city": "Alburgh",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "arlington-vt",
      "city": "Arlington",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "ascutney-vt",
      "city": "Ascutney",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "averill-vt",
      "city": "Averill",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bakersfield-vt",
      "city": "Bakersfield",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "barnard-vt",
      "city": "Barnard",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "barnet-vt",
      "city": "Barnet",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "barre-vt",
      "city": "Barre",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "barton-vt",
      "city": "Barton",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "beebe-plain-vt",
      "city": "Beebe Plain",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "beecher-falls-vt",
      "city": "Beecher Falls",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bellows-falls-vt",
      "city": "Bellows Falls",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "belmont-vt",
      "city": "Belmont",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "belvidere-center-vt",
      "city": "Belvidere Center",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bennington-vt",
      "city": "Bennington",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "benson-vt",
      "city": "Benson",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bethel-vt",
      "city": "Bethel",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bomoseen-vt",
      "city": "Bomoseen",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bondville-vt",
      "city": "Bondville",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bradford-vt",
      "city": "Bradford",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "brandon-vt",
      "city": "Brandon",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "brattleboro-vt",
      "city": "Brattleboro",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bridgewater-vt",
      "city": "Bridgewater",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bridgewater-corners-vt",
      "city": "Bridgewater Corners",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bridport-vt",
      "city": "Bridport",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "bristol-vt",
      "city": "Bristol",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "brookfield-vt",
      "city": "Brookfield",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "brownsville-vt",
      "city": "Brownsville",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "cabot-vt",
      "city": "Cabot",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "calais-vt",
      "city": "Calais",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "cambridge-vt",
      "city": "Cambridge",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "cambridgeport-vt",
      "city": "Cambridgeport",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "canaan-vt",
      "city": "Canaan",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "castleton-vt",
      "city": "Castleton",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "cavendish-vt",
      "city": "Cavendish",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "center-rutland-vt",
      "city": "Center Rutland",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "charlotte-vt",
      "city": "Charlotte",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "chelsea-vt",
      "city": "Chelsea",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "chester-vt",
      "city": "Chester",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "chester-depot-vt",
      "city": "Chester Depot",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "chittenden-vt",
      "city": "Chittenden",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "concord-vt",
      "city": "Concord",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "corinth-vt",
      "city": "Corinth",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "coventry-vt",
      "city": "Coventry",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "craftsbury-vt",
      "city": "Craftsbury",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "craftsbury-common-vt",
      "city": "Craftsbury Common",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "cuttingsville-vt",
      "city": "Cuttingsville",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "danby-vt",
      "city": "Danby",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "danville-vt",
      "city": "Danville",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "derby-vt",
      "city": "Derby",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "derby-line-vt",
      "city": "Derby Line",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "dorset-vt",
      "city": "Dorset",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-arlington-vt",
      "city": "East Arlington",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-barre-vt",
      "city": "East Barre",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-berkshire-vt",
      "city": "East Berkshire",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-burke-vt",
      "city": "East Burke",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-calais-vt",
      "city": "East Calais",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-charleston-vt",
      "city": "East Charleston",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-corinth-vt",
      "city": "East Corinth",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-dorset-vt",
      "city": "East Dorset",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-dover-vt",
      "city": "East Dover",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-fairfield-vt",
      "city": "East Fairfield",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-hardwick-vt",
      "city": "East Hardwick",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-haven-vt",
      "city": "East Haven",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-middlebury-vt",
      "city": "East Middlebury",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-montpelier-vt",
      "city": "East Montpelier",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-poultney-vt",
      "city": "East Poultney",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-randolph-vt",
      "city": "East Randolph",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-ryegate-vt",
      "city": "East Ryegate",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-saint-johnsbury-vt",
      "city": "East Saint Johnsbury",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-thetford-vt",
      "city": "East Thetford",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "east-wallingford-vt",
      "city": "East Wallingford",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "eden-vt",
      "city": "Eden",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "eden-mills-vt",
      "city": "Eden Mills",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "enosburg-falls-vt",
      "city": "Enosburg Falls",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "essex-vt",
      "city": "Essex",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "essex-junction-vt",
      "city": "Essex Junction",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "fair-haven-vt",
      "city": "Fair Haven",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "fairfax-vt",
      "city": "Fairfax",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "fairfield-vt",
      "city": "Fairfield",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "fairlee-vt",
      "city": "Fairlee",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "ferrisburg-vt",
      "city": "Ferrisburg",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "ferrisburgh-vt",
      "city": "Ferrisburgh",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "florence-vt",
      "city": "Florence",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "forest-dale-vt",
      "city": "Forest Dale",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "franklin-vt",
      "city": "Franklin",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "gaysville-vt",
      "city": "Gaysville",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "gilman-vt",
      "city": "Gilman",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "glover-vt",
      "city": "Glover",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "grafton-vt",
      "city": "Grafton",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "granby-vt",
      "city": "Granby",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "grand-isle-vt",
      "city": "Grand Isle",
      "state": "Vermont",
      "stateCode": "VT"
    },
    {
      "slug": "graniteville-vt",
      "city": "Graniteville",
      "state": "Vermont",
      "stateCode": "VT"
    }
  ],
  "VA": [
    {
      "slug": "virginia-beach-va",
      "city": "Virginia Beach",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "norfolk-va",
      "city": "Norfolk",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "chesapeake-va",
      "city": "Chesapeake",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "richmond-va",
      "city": "Richmond",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "arlington-va",
      "city": "Arlington",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "newport-news-va",
      "city": "Newport News",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "alexandria-va",
      "city": "Alexandria",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "east-hampton-va",
      "city": "East Hampton",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "hampton-va",
      "city": "Hampton",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "roanoke-va",
      "city": "Roanoke",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "portsmouth-heights-va",
      "city": "Portsmouth Heights",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "portsmouth-va",
      "city": "Portsmouth",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "suffolk-va",
      "city": "Suffolk",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "south-suffolk-va",
      "city": "South Suffolk",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "lynchburg-va",
      "city": "Lynchburg",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "centreville-va",
      "city": "Centreville",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "dale-city-va",
      "city": "Dale City",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "west-lynchburg-va",
      "city": "West Lynchburg",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "reston-va",
      "city": "Reston",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "harrisonburg-va",
      "city": "Harrisonburg",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "leesburg-va",
      "city": "Leesburg",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "mclean-va",
      "city": "Mclean",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "charlottesville-va",
      "city": "Charlottesville",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "tuckahoe-va",
      "city": "Tuckahoe",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "blacksburg-va",
      "city": "Blacksburg",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "ashburn-va",
      "city": "Ashburn",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "danville-va",
      "city": "Danville",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "manassas-va",
      "city": "Manassas",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "lake-ridge-va",
      "city": "Lake Ridge",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "burke-va",
      "city": "Burke",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "annandale-va",
      "city": "Annandale",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "mechanicsville-va",
      "city": "Mechanicsville",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "linton-hall-va",
      "city": "Linton Hall",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "oakton-va",
      "city": "Oakton",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "oak-hill-va",
      "city": "Oak Hill",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "petersburg-va",
      "city": "Petersburg",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "springfield-va",
      "city": "Springfield",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "west-falls-church-va",
      "city": "West Falls Church",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "fredericksburg-va",
      "city": "Fredericksburg",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "sterling-va",
      "city": "Sterling",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "winchester-va",
      "city": "Winchester",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "salem-va",
      "city": "Salem",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "cave-spring-va",
      "city": "Cave Spring",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "short-pump-va",
      "city": "Short Pump",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "herndon-va",
      "city": "Herndon",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "staunton-va",
      "city": "Staunton",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "south-riding-va",
      "city": "South Riding",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "fairfax-va",
      "city": "Fairfax",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "baileys-crossroads-va",
      "city": "Baileys Crossroads",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "chantilly-va",
      "city": "Chantilly",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "lincolnia-va",
      "city": "Lincolnia",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "west-springfield-va",
      "city": "West Springfield",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "hopewell-va",
      "city": "Hopewell",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "christiansburg-va",
      "city": "Christiansburg",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "waynesboro-va",
      "city": "Waynesboro",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "chester-va",
      "city": "Chester",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "woodlawn-va",
      "city": "Woodlawn",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "rose-hill-va",
      "city": "Rose Hill",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "tysons-va",
      "city": "Tysons",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "montclair-va",
      "city": "Montclair",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "lorton-va",
      "city": "Lorton",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "midlothian-va",
      "city": "Midlothian",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "meadowbrook-va",
      "city": "Meadowbrook",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "franconia-va",
      "city": "Franconia",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "colonial-heights-va",
      "city": "Colonial Heights",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "culpeper-va",
      "city": "Culpeper",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "radford-va",
      "city": "Radford",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "idylwood-va",
      "city": "Idylwood",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "bristol-va",
      "city": "Bristol",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "laurel-va",
      "city": "Laurel",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "vienna-va",
      "city": "Vienna",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "bon-air-va",
      "city": "Bon Air",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "buckhall-va",
      "city": "Buckhall",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "sudley-va",
      "city": "Sudley",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "wolf-trap-va",
      "city": "Wolf Trap",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "fort-hunt-va",
      "city": "Fort Hunt",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "cherry-hill-va",
      "city": "Cherry Hill",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "hybla-valley-va",
      "city": "Hybla Valley",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "manassas-park-va",
      "city": "Manassas Park",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "highland-springs-va",
      "city": "Highland Springs",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "great-falls-va",
      "city": "Great Falls",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "merrifield-va",
      "city": "Merrifield",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "front-royal-va",
      "city": "Front Royal",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "williamsburg-va",
      "city": "Williamsburg",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "abingdon-va",
      "city": "Abingdon",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "accomac-va",
      "city": "Accomac",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "achilles-va",
      "city": "Achilles",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "afton-va",
      "city": "Afton",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "alberta-va",
      "city": "Alberta",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "aldie-va",
      "city": "Aldie",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "altavista-va",
      "city": "Altavista",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "alton-va",
      "city": "Alton",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "amelia-court-house-va",
      "city": "Amelia Court House",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "amherst-va",
      "city": "Amherst",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "amissville-va",
      "city": "Amissville",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "ammon-va",
      "city": "Ammon",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "amonate-va",
      "city": "Amonate",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "andover-va",
      "city": "Andover",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "appalachia-va",
      "city": "Appalachia",
      "state": "Virginia",
      "stateCode": "VA"
    },
    {
      "slug": "appomattox-va",
      "city": "Appomattox",
      "state": "Virginia",
      "stateCode": "VA"
    }
  ],
  "WA": [
    {
      "slug": "seattle-wa",
      "city": "Seattle",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "tri-cities-wa",
      "city": "Tri-cities",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "spokane-wa",
      "city": "Spokane",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "tacoma-wa",
      "city": "Tacoma",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "vancouver-wa",
      "city": "Vancouver",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "bellevue-wa",
      "city": "Bellevue",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "kent-wa",
      "city": "Kent",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "everett-wa",
      "city": "Everett",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "renton-wa",
      "city": "Renton",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "federal-way-wa",
      "city": "Federal Way",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "spokane-valley-wa",
      "city": "Spokane Valley",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "yakima-wa",
      "city": "Yakima",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "kirkland-wa",
      "city": "Kirkland",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "bellingham-wa",
      "city": "Bellingham",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "kennewick-wa",
      "city": "Kennewick",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "auburn-wa",
      "city": "Auburn",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "pasco-wa",
      "city": "Pasco",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "marysville-wa",
      "city": "Marysville",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "redmond-wa",
      "city": "Redmond",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "lakewood-wa",
      "city": "Lakewood",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "olympia-wa",
      "city": "Olympia",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "shoreline-wa",
      "city": "Shoreline",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "richland-wa",
      "city": "Richland",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "south-hill-wa",
      "city": "South Hill",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "sammamish-wa",
      "city": "Sammamish",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "burien-wa",
      "city": "Burien",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "lacey-wa",
      "city": "Lacey",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "city-of-sammamish-wa",
      "city": "City Of Sammamish",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "bothell-wa",
      "city": "Bothell",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "edmonds-wa",
      "city": "Edmonds",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "puyallup-wa",
      "city": "Puyallup",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "bremerton-wa",
      "city": "Bremerton",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "lynnwood-wa",
      "city": "Lynnwood",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "longview-wa",
      "city": "Longview",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "issaquah-wa",
      "city": "Issaquah",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "parkland-wa",
      "city": "Parkland",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "mount-vernon-wa",
      "city": "Mount Vernon",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "west-lake-sammamish-wa",
      "city": "West Lake Sammamish",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "wenatchee-wa",
      "city": "Wenatchee",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "university-place-wa",
      "city": "University Place",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "pullman-wa",
      "city": "Pullman",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "walla-walla-wa",
      "city": "Walla Walla",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "des-moines-wa",
      "city": "Des Moines",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "lake-stevens-wa",
      "city": "Lake Stevens",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "east-hill-meridian-wa",
      "city": "East Hill-meridian",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "seatac-wa",
      "city": "Seatac",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "spanaway-wa",
      "city": "Spanaway",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "north-creek-wa",
      "city": "North Creek",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "opportunity-wa",
      "city": "Opportunity",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "maple-valley-wa",
      "city": "Maple Valley",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "mercer-island-wa",
      "city": "Mercer Island",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "bainbridge-island-wa",
      "city": "Bainbridge Island",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "graham-wa",
      "city": "Graham",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "picnic-point-north-lynnwood-wa",
      "city": "Picnic Point-north Lynnwood",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "inglewood-finn-hill-wa",
      "city": "Inglewood-finn Hill",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "oak-harbor-wa",
      "city": "Oak Harbor",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "cottage-lake-wa",
      "city": "Cottage Lake",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "moses-lake-wa",
      "city": "Moses Lake",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "kenmore-wa",
      "city": "Kenmore",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "camas-wa",
      "city": "Camas",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "mukilteo-wa",
      "city": "Mukilteo",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "west-lake-stevens-wa",
      "city": "West Lake Stevens",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "mountlake-terrace-wa",
      "city": "Mountlake Terrace",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "silver-firs-wa",
      "city": "Silver Firs",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "eastmont-wa",
      "city": "Eastmont",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "mill-creek-wa",
      "city": "Mill Creek",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "tukwila-wa",
      "city": "Tukwila",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "bonney-lake-wa",
      "city": "Bonney Lake",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "salmon-creek-wa",
      "city": "Salmon Creek",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "orchards-wa",
      "city": "Orchards",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "port-angeles-wa",
      "city": "Port Angeles",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "hazel-dell-wa",
      "city": "Hazel Dell",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "battle-ground-wa",
      "city": "Battle Ground",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "silverdale-wa",
      "city": "Silverdale",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "covington-wa",
      "city": "Covington",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "tumwater-wa",
      "city": "Tumwater",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "fairwood-wa",
      "city": "Fairwood",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "ellensburg-wa",
      "city": "Ellensburg",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "columbia-city-wa",
      "city": "Columbia City",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "arlington-wa",
      "city": "Arlington",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "union-hill-novelty-hill-wa",
      "city": "Union Hill-novelty Hill",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "frederickson-wa",
      "city": "Frederickson",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "five-corners-wa",
      "city": "Five Corners",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "anacortes-wa",
      "city": "Anacortes",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "monroe-wa",
      "city": "Monroe",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "centralia-wa",
      "city": "Centralia",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "bothell-west-wa",
      "city": "Bothell West",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "sunnyside-wa",
      "city": "Sunnyside",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "aberdeen-wa",
      "city": "Aberdeen",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "mill-creek-east-wa",
      "city": "Mill Creek East",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "bryn-mawr-skyway-wa",
      "city": "Bryn Mawr-skyway",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "martha-lake-wa",
      "city": "Martha Lake",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "washougal-wa",
      "city": "Washougal",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "acme-wa",
      "city": "Acme",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "addy-wa",
      "city": "Addy",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "adna-wa",
      "city": "Adna",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "airway-heights-wa",
      "city": "Airway Heights",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "albion-wa",
      "city": "Albion",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "allyn-wa",
      "city": "Allyn",
      "state": "Washington",
      "stateCode": "WA"
    },
    {
      "slug": "almira-wa",
      "city": "Almira",
      "state": "Washington",
      "stateCode": "WA"
    }
  ],
  "WV": [
    {
      "slug": "huntington-wv",
      "city": "Huntington",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "charleston-wv",
      "city": "Charleston",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "parkersburg-wv",
      "city": "Parkersburg",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "morgantown-wv",
      "city": "Morgantown",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "wheeling-wv",
      "city": "Wheeling",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "weirton-heights-wv",
      "city": "Weirton Heights",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "weirton-wv",
      "city": "Weirton",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "fairmont-wv",
      "city": "Fairmont",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "martinsburg-wv",
      "city": "Martinsburg",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "beckley-wv",
      "city": "Beckley",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "clarksburg-wv",
      "city": "Clarksburg",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "accoville-wv",
      "city": "Accoville",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "adrian-wv",
      "city": "Adrian",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "advent-wv",
      "city": "Advent",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "albright-wv",
      "city": "Albright",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "alderson-wv",
      "city": "Alderson",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "alkol-wv",
      "city": "Alkol",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "allen-junction-wv",
      "city": "Allen Junction",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "alloy-wv",
      "city": "Alloy",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "alma-wv",
      "city": "Alma",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "alum-bridge-wv",
      "city": "Alum Bridge",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "alum-creek-wv",
      "city": "Alum Creek",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "ameagle-wv",
      "city": "Ameagle",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "amherstdale-wv",
      "city": "Amherstdale",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "amigo-wv",
      "city": "Amigo",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "amma-wv",
      "city": "Amma",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "anawalt-wv",
      "city": "Anawalt",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "anmoore-wv",
      "city": "Anmoore",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "ansted-wv",
      "city": "Ansted",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "apple-grove-wv",
      "city": "Apple Grove",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "arbovale-wv",
      "city": "Arbovale",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "arnett-wv",
      "city": "Arnett",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "arnoldsburg-wv",
      "city": "Arnoldsburg",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "arthurdale-wv",
      "city": "Arthurdale",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "artie-wv",
      "city": "Artie",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "asbury-wv",
      "city": "Asbury",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "ashford-wv",
      "city": "Ashford",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "ashton-wv",
      "city": "Ashton",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "athens-wv",
      "city": "Athens",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "auburn-wv",
      "city": "Auburn",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "augusta-wv",
      "city": "Augusta",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "aurora-wv",
      "city": "Aurora",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "auto-wv",
      "city": "Auto",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "avondale-wv",
      "city": "Avondale",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "baisden-wv",
      "city": "Baisden",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "baker-wv",
      "city": "Baker",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bakerton-wv",
      "city": "Bakerton",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bald-knob-wv",
      "city": "Bald Knob",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "ballard-wv",
      "city": "Ballard",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "ballengee-wv",
      "city": "Ballengee",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bancroft-wv",
      "city": "Bancroft",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "barboursville-wv",
      "city": "Barboursville",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "barrackville-wv",
      "city": "Barrackville",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bartley-wv",
      "city": "Bartley",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bartow-wv",
      "city": "Bartow",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "baxter-wv",
      "city": "Baxter",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bayard-wv",
      "city": "Bayard",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "beaver-wv",
      "city": "Beaver",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "beech-bottom-wv",
      "city": "Beech Bottom",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "beeson-wv",
      "city": "Beeson",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "belington-wv",
      "city": "Belington",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "belle-wv",
      "city": "Belle",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "belleville-wv",
      "city": "Belleville",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "belmont-wv",
      "city": "Belmont",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "belva-wv",
      "city": "Belva",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bens-run-wv",
      "city": "Bens Run",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bentree-wv",
      "city": "Bentree",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "benwood-wv",
      "city": "Benwood",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "berea-wv",
      "city": "Berea",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bergoo-wv",
      "city": "Bergoo",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "berkeley-springs-wv",
      "city": "Berkeley Springs",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "berwind-wv",
      "city": "Berwind",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bethany-wv",
      "city": "Bethany",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "beverly-wv",
      "city": "Beverly",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bickmore-wv",
      "city": "Bickmore",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "big-bend-wv",
      "city": "Big Bend",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "big-creek-wv",
      "city": "Big Creek",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "big-run-wv",
      "city": "Big Run",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "big-sandy-wv",
      "city": "Big Sandy",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "big-springs-wv",
      "city": "Big Springs",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bim-wv",
      "city": "Bim",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "birch-river-wv",
      "city": "Birch River",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "blacksville-wv",
      "city": "Blacksville",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "blair-wv",
      "city": "Blair",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "blandville-wv",
      "city": "Blandville",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bloomery-wv",
      "city": "Bloomery",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bloomingrose-wv",
      "city": "Bloomingrose",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "blount-wv",
      "city": "Blount",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "blue-creek-wv",
      "city": "Blue Creek",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "blue-jay-wv",
      "city": "Blue Jay",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bluefield-wv",
      "city": "Bluefield",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bob-white-wv",
      "city": "Bob White",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bolt-wv",
      "city": "Bolt",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bomont-wv",
      "city": "Bomont",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "boomer-wv",
      "city": "Boomer",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "booth-wv",
      "city": "Booth",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "borderland-wv",
      "city": "Borderland",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bowden-wv",
      "city": "Bowden",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bradley-wv",
      "city": "Bradley",
      "state": "West Virginia",
      "stateCode": "WV"
    },
    {
      "slug": "bradshaw-wv",
      "city": "Bradshaw",
      "state": "West Virginia",
      "stateCode": "WV"
    }
  ],
  "WI": [
    {
      "slug": "milwaukee-wi",
      "city": "Milwaukee",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "madison-wi",
      "city": "Madison",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "green-bay-wi",
      "city": "Green Bay",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "kenosha-wi",
      "city": "Kenosha",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "racine-wi",
      "city": "Racine",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "appleton-wi",
      "city": "Appleton",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "waukesha-wi",
      "city": "Waukesha",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "eau-claire-wi",
      "city": "Eau Claire",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "oshkosh-wi",
      "city": "Oshkosh",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "janesville-wi",
      "city": "Janesville",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "west-allis-wi",
      "city": "West Allis",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "la-crosse-wi",
      "city": "La Crosse",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "north-la-crosse-wi",
      "city": "North La Crosse",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "sheboygan-wi",
      "city": "Sheboygan",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "wauwatosa-wi",
      "city": "Wauwatosa",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "fond-du-lac-wi",
      "city": "Fond Du Lac",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "new-berlin-wi",
      "city": "New Berlin",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "wausau-wi",
      "city": "Wausau",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "brookfield-wi",
      "city": "Brookfield",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "greenfield-wi",
      "city": "Greenfield",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "beloit-wi",
      "city": "Beloit",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "franklin-wi",
      "city": "Franklin",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "menomonee-falls-wi",
      "city": "Menomonee Falls",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "oak-creek-wi",
      "city": "Oak Creek",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "manitowoc-wi",
      "city": "Manitowoc",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "sun-prairie-wi",
      "city": "Sun Prairie",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "west-bend-wi",
      "city": "West Bend",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "fitchburg-wi",
      "city": "Fitchburg",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "stevens-point-wi",
      "city": "Stevens Point",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "superior-wi",
      "city": "Superior",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "mount-pleasant-wi",
      "city": "Mount Pleasant",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "neenah-wi",
      "city": "Neenah",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "muskego-wi",
      "city": "Muskego",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "de-pere-wi",
      "city": "De Pere",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "caledonia-wi",
      "city": "Caledonia",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "watertown-wi",
      "city": "Watertown",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "mequon-wi",
      "city": "Mequon",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "south-milwaukee-wi",
      "city": "South Milwaukee",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "pleasant-prairie-wi",
      "city": "Pleasant Prairie",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "germantown-wi",
      "city": "Germantown",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "howard-wi",
      "city": "Howard",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "middleton-wi",
      "city": "Middleton",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "marshfield-wi",
      "city": "Marshfield",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "onalaska-wi",
      "city": "Onalaska",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "cudahy-wi",
      "city": "Cudahy",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "wisconsin-rapids-wi",
      "city": "Wisconsin Rapids",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "menasha-wi",
      "city": "Menasha",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "ashwaubenon-wi",
      "city": "Ashwaubenon",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "beaver-dam-wi",
      "city": "Beaver Dam",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "oconomowoc-wi",
      "city": "Oconomowoc",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "menomonie-wi",
      "city": "Menomonie",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "kaukauna-wi",
      "city": "Kaukauna",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "bellevue-wi",
      "city": "Bellevue",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "river-falls-wi",
      "city": "River Falls",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "weston-wi",
      "city": "Weston",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "abbotsford-wi",
      "city": "Abbotsford",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "abrams-wi",
      "city": "Abrams",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "adams-wi",
      "city": "Adams",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "adell-wi",
      "city": "Adell",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "afton-wi",
      "city": "Afton",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "albany-wi",
      "city": "Albany",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "algoma-wi",
      "city": "Algoma",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "allenton-wi",
      "city": "Allenton",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "alma-wi",
      "city": "Alma",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "alma-center-wi",
      "city": "Alma Center",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "almena-wi",
      "city": "Almena",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "almond-wi",
      "city": "Almond",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "altoona-wi",
      "city": "Altoona",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "amberg-wi",
      "city": "Amberg",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "amery-wi",
      "city": "Amery",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "amherst-wi",
      "city": "Amherst",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "amherst-junction-wi",
      "city": "Amherst Junction",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "aniwa-wi",
      "city": "Aniwa",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "antigo-wi",
      "city": "Antigo",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "arcadia-wi",
      "city": "Arcadia",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "arena-wi",
      "city": "Arena",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "argonne-wi",
      "city": "Argonne",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "argyle-wi",
      "city": "Argyle",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "arkansaw-wi",
      "city": "Arkansaw",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "arkdale-wi",
      "city": "Arkdale",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "arlington-wi",
      "city": "Arlington",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "armstrong-creek-wi",
      "city": "Armstrong Creek",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "arpin-wi",
      "city": "Arpin",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "ashippun-wi",
      "city": "Ashippun",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "ashland-wi",
      "city": "Ashland",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "athelstane-wi",
      "city": "Athelstane",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "athens-wi",
      "city": "Athens",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "auburndale-wi",
      "city": "Auburndale",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "augusta-wi",
      "city": "Augusta",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "avalon-wi",
      "city": "Avalon",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "avoca-wi",
      "city": "Avoca",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "babcock-wi",
      "city": "Babcock",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "bagley-wi",
      "city": "Bagley",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "baileys-harbor-wi",
      "city": "Baileys Harbor",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "baldwin-wi",
      "city": "Baldwin",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "balsam-lake-wi",
      "city": "Balsam Lake",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "bancroft-wi",
      "city": "Bancroft",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "bangor-wi",
      "city": "Bangor",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "baraboo-wi",
      "city": "Baraboo",
      "state": "Wisconsin",
      "stateCode": "WI"
    },
    {
      "slug": "barneveld-wi",
      "city": "Barneveld",
      "state": "Wisconsin",
      "stateCode": "WI"
    }
  ],
  "WY": [
    {
      "slug": "cheyenne-wy",
      "city": "Cheyenne",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "casper-wy",
      "city": "Casper",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "gillette-wy",
      "city": "Gillette",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "laramie-wy",
      "city": "Laramie",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "rock-springs-wy",
      "city": "Rock Springs",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "sheridan-wy",
      "city": "Sheridan",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "afton-wy",
      "city": "Afton",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "aladdin-wy",
      "city": "Aladdin",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "albin-wy",
      "city": "Albin",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "alcova-wy",
      "city": "Alcova",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "alpine-wy",
      "city": "Alpine",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "alta-wy",
      "city": "Alta",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "alva-wy",
      "city": "Alva",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "arapahoe-wy",
      "city": "Arapahoe",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "arminto-wy",
      "city": "Arminto",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "arvada-wy",
      "city": "Arvada",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "auburn-wy",
      "city": "Auburn",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "baggs-wy",
      "city": "Baggs",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "bairoil-wy",
      "city": "Bairoil",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "banner-wy",
      "city": "Banner",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "basin-wy",
      "city": "Basin",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "bedford-wy",
      "city": "Bedford",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "beulah-wy",
      "city": "Beulah",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "big-horn-wy",
      "city": "Big Horn",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "big-piney-wy",
      "city": "Big Piney",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "bill-wy",
      "city": "Bill",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "bondurant-wy",
      "city": "Bondurant",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "bosler-wy",
      "city": "Bosler",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "boulder-wy",
      "city": "Boulder",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "buffalo-wy",
      "city": "Buffalo",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "buford-wy",
      "city": "Buford",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "burlington-wy",
      "city": "Burlington",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "burns-wy",
      "city": "Burns",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "byron-wy",
      "city": "Byron",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "carlile-wy",
      "city": "Carlile",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "carpenter-wy",
      "city": "Carpenter",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "centennial-wy",
      "city": "Centennial",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "chugwater-wy",
      "city": "Chugwater",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "clearmont-wy",
      "city": "Clearmont",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "cody-wy",
      "city": "Cody",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "cokeville-wy",
      "city": "Cokeville",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "cora-wy",
      "city": "Cora",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "cowley-wy",
      "city": "Cowley",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "crowheart-wy",
      "city": "Crowheart",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "daniel-wy",
      "city": "Daniel",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "dayton-wy",
      "city": "Dayton",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "deaver-wy",
      "city": "Deaver",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "devils-tower-wy",
      "city": "Devils Tower",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "diamondville-wy",
      "city": "Diamondville",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "dixon-wy",
      "city": "Dixon",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "douglas-wy",
      "city": "Douglas",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "dubois-wy",
      "city": "Dubois",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "edgerton-wy",
      "city": "Edgerton",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "elk-mountain-wy",
      "city": "Elk Mountain",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "emblem-wy",
      "city": "Emblem",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "encampment-wy",
      "city": "Encampment",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "etna-wy",
      "city": "Etna",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "evanston-wy",
      "city": "Evanston",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "evansville-wy",
      "city": "Evansville",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "fairview-wy",
      "city": "Fairview",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "farson-wy",
      "city": "Farson",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "fe-warren-afb-wy",
      "city": "Fe Warren Afb",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "fort-bridger-wy",
      "city": "Fort Bridger",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "fort-laramie-wy",
      "city": "Fort Laramie",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "fort-washakie-wy",
      "city": "Fort Washakie",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "four-corners-wy",
      "city": "Four Corners",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "frannie-wy",
      "city": "Frannie",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "freedom-wy",
      "city": "Freedom",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "frontier-wy",
      "city": "Frontier",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "ft-warren-afb-wy",
      "city": "Ft Warren Afb",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "garrett-wy",
      "city": "Garrett",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "glendo-wy",
      "city": "Glendo",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "glenrock-wy",
      "city": "Glenrock",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "granger-wy",
      "city": "Granger",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "granite-canon-wy",
      "city": "Granite Canon",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "green-river-wy",
      "city": "Green River",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "greybull-wy",
      "city": "Greybull",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "grover-wy",
      "city": "Grover",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "guernsey-wy",
      "city": "Guernsey",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "hamilton-dome-wy",
      "city": "Hamilton Dome",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "hanna-wy",
      "city": "Hanna",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "hartville-wy",
      "city": "Hartville",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "hawk-springs-wy",
      "city": "Hawk Springs",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "hiland-wy",
      "city": "Hiland",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "hillsdale-wy",
      "city": "Hillsdale",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "horse-creek-wy",
      "city": "Horse Creek",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "hudson-wy",
      "city": "Hudson",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "hulett-wy",
      "city": "Hulett",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "huntley-wy",
      "city": "Huntley",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "hyattville-wy",
      "city": "Hyattville",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "jackson-wy",
      "city": "Jackson",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "jay-em-wy",
      "city": "Jay Em",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "jeffrey-city-wy",
      "city": "Jeffrey City",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "jelm-wy",
      "city": "Jelm",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "kaycee-wy",
      "city": "Kaycee",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "kelly-wy",
      "city": "Kelly",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "kemmerer-wy",
      "city": "Kemmerer",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "kinnear-wy",
      "city": "Kinnear",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "kirby-wy",
      "city": "Kirby",
      "state": "Wyoming",
      "stateCode": "WY"
    },
    {
      "slug": "la-barge-wy",
      "city": "La Barge",
      "state": "Wyoming",
      "stateCode": "WY"
    }
  ]
} as const;
