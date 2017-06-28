# gmaps_extractor

## What ? 

This is a simple brute force javascript to extract data (Name, Category, Address, Phone Number, Website and Availability) from multiple site entries
given by a generic search in Google Maps.

## Why ? 

If you are a Hamburguer freak, you might want to look for all the nice burguers around you.
 
So you just have to open GMaps over your surroundings and search 'hamburger restaurant'.

Then, with this script you will get a compiled spreadsheet with all the results ordered by relevance (according to Google criteria).

## How ? 

1. Copy and paste the whole script directly into your web console.

2. Type read_data(n).

3. You will watch an unintended animation and some loggings popping on your console ('read 1, read 2, read 3 ... read n-1, read n')

4. As soon as the counting reaches n your browser shall start downloading your compiled data as a csv.

5. If you want to compile another result set you can just change your searchstring and type read_data(n) again.
