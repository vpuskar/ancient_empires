-- Add lat/lng centroid columns to provinces table
ALTER TABLE provinces ADD COLUMN IF NOT EXISTS lat NUMERIC(9,6);
ALTER TABLE provinces ADD COLUMN IF NOT EXISTS lng NUMERIC(9,6);

-- Populate centroids for 52 Roman provinces
-- Approximate geographic centers based on historical boundaries
UPDATE provinces SET lat = 38.05,  lng = 22.80  WHERE id = 1;   -- Achaea (Peloponnese/Central Greece)
UPDATE provinces SET lat = 28.50,  lng = 30.80  WHERE id = 2;   -- Aegyptus (Nile valley center)
UPDATE provinces SET lat = 34.80,  lng = 9.50   WHERE id = 3;   -- Africa (modern Tunisia)
UPDATE provinces SET lat = 44.95,  lng = 6.85   WHERE id = 4;   -- Alpes Cottiae (Cottian Alps)
UPDATE provinces SET lat = 43.90,  lng = 7.20   WHERE id = 5;   -- Alpes Maritimae (Maritime Alps)
UPDATE provinces SET lat = 45.90,  lng = 7.40   WHERE id = 6;   -- Alpes Poenninae (Great St Bernard)
UPDATE provinces SET lat = 29.50,  lng = 35.50  WHERE id = 7;   -- Arabia Petraea (Petra region)
UPDATE provinces SET lat = 39.50,  lng = 43.50  WHERE id = 8;   -- Armenia Inferior (eastern Turkey)
UPDATE provinces SET lat = 38.60,  lng = 28.00  WHERE id = 9;   -- Asia (western Anatolia)
UPDATE provinces SET lat = 36.30,  lng = 43.10  WHERE id = 10;  -- Assyria (northern Mesopotamia)
UPDATE provinces SET lat = 40.20,  lng = 29.50  WHERE id = 11;  -- Bithynia (NW Anatolia)
UPDATE provinces SET lat = 52.50,  lng = -1.50  WHERE id = 12;  -- Britannia (central England)
UPDATE provinces SET lat = 38.70,  lng = 35.50  WHERE id = 13;  -- Cappadocia (central Anatolia)
UPDATE provinces SET lat = 36.90,  lng = 34.90  WHERE id = 14;  -- Cilicia (southern Anatolia coast)
UPDATE provinces SET lat = 37.70,  lng = 38.50  WHERE id = 15;  -- Commagene (SE Turkey, Nemrut area)
UPDATE provinces SET lat = 37.40,  lng = 43.00  WHERE id = 16;  -- Corduene (SE Turkey/N Iraq border)
UPDATE provinces SET lat = 40.50,  lng = 9.00   WHERE id = 17;  -- Corsica et Sardinia
UPDATE provinces SET lat = 33.50,  lng = 24.00  WHERE id = 18;  -- Creta et Cyrenaica (Crete + Libya coast)
UPDATE provinces SET lat = 35.00,  lng = 33.00  WHERE id = 19;  -- Cyprus
UPDATE provinces SET lat = 45.80,  lng = 24.00  WHERE id = 20;  -- Dacia (modern Romania)
UPDATE provinces SET lat = 43.50,  lng = 16.50  WHERE id = 21;  -- Dalmatia (Croatian coast)
UPDATE provinces SET lat = 39.60,  lng = 20.80  WHERE id = 22;  -- Epirus (NW Greece/S Albania)
UPDATE provinces SET lat = 39.50,  lng = 32.50  WHERE id = 23;  -- Galatia (central Anatolia, Ankara area)
UPDATE provinces SET lat = 44.50,  lng = 0.50   WHERE id = 24;  -- Gallia Aquitania (SW France)
UPDATE provinces SET lat = 49.80,  lng = 3.50   WHERE id = 25;  -- Gallia Belgica (NE France/Belgium)
UPDATE provinces SET lat = 47.00,  lng = 2.50   WHERE id = 26;  -- Gallia Lugdunensis (central France)
UPDATE provinces SET lat = 43.50,  lng = 3.50   WHERE id = 27;  -- Gallia Narbonensis (S France)
UPDATE provinces SET lat = 51.00,  lng = 5.50   WHERE id = 28;  -- Germania Inferior (Netherlands/W Germany)
UPDATE provinces SET lat = 49.00,  lng = 7.50   WHERE id = 29;  -- Germania Superior (Rhineland)
UPDATE provinces SET lat = 37.50,  lng = -4.50  WHERE id = 30;  -- Hispania Baetica (Andalusia)
UPDATE provinces SET lat = 39.50,  lng = -7.50  WHERE id = 31;  -- Hispania Lusitania (Portugal)
UPDATE provinces SET lat = 41.50,  lng = -2.00  WHERE id = 32;  -- Hispania Tarraconensis (N/E Spain)
UPDATE provinces SET lat = 42.00,  lng = 12.50  WHERE id = 33;  -- Italia
UPDATE provinces SET lat = 31.80,  lng = 35.20  WHERE id = 34;  -- Iudaea (Jerusalem area)
UPDATE provinces SET lat = 37.80,  lng = 33.50  WHERE id = 35;  -- Lycaonia (south-central Anatolia)
UPDATE provinces SET lat = 36.60,  lng = 29.80  WHERE id = 36;  -- Lycia (SW Anatolia coast)
UPDATE provinces SET lat = 41.00,  lng = 22.50  WHERE id = 37;  -- Macedonia
UPDATE provinces SET lat = 36.00,  lng = 2.50   WHERE id = 38;  -- Mauretania Caesariensis (central Algeria)
UPDATE provinces SET lat = 35.00,  lng = -5.00  WHERE id = 39;  -- Mauretania Tingitana (N Morocco)
UPDATE provinces SET lat = 43.70,  lng = 24.50  WHERE id = 40;  -- Moesia (N Bulgaria/S Romania)
UPDATE provinces SET lat = 47.50,  lng = 13.50  WHERE id = 41;  -- Noricum (Austria)
UPDATE provinces SET lat = 36.20,  lng = 6.50   WHERE id = 42;  -- Numidia (E Algeria)
UPDATE provinces SET lat = 37.00,  lng = 39.00  WHERE id = 43;  -- Osroene (Edessa/Urfa area)
UPDATE provinces SET lat = 46.50,  lng = 18.00  WHERE id = 44;  -- Pannonia (Hungary/W Serbia)
UPDATE provinces SET lat = 37.20,  lng = 31.00  WHERE id = 45;  -- Pamphylia (S Anatolia, Antalya area)
UPDATE provinces SET lat = 38.00,  lng = 31.00  WHERE id = 46;  -- Pisidia (SW Anatolia interior)
UPDATE provinces SET lat = 40.50,  lng = 37.00  WHERE id = 47;  -- Pontus (NE Anatolia, Black Sea coast)
UPDATE provinces SET lat = 47.50,  lng = 10.50  WHERE id = 48;  -- Raetia (S Bavaria/E Switzerland)
UPDATE provinces SET lat = 37.50,  lng = 14.20  WHERE id = 49;  -- Sicilia
UPDATE provinces SET lat = 38.50,  lng = 39.50  WHERE id = 50;  -- Sophene (E Turkey, Elazig area)
UPDATE provinces SET lat = 34.80,  lng = 36.80  WHERE id = 51;  -- Syria (Antioch to Damascus corridor)
UPDATE provinces SET lat = 42.00,  lng = 25.50  WHERE id = 52;  -- Thracia (Bulgaria/European Turkey)
