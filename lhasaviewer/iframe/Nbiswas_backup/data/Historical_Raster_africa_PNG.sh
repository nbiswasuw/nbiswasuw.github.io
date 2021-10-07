#!usr/bin/bash

# Historical Raster backened processing of LIS ATLAS Output for All Regions of Africa
# Input is NETCDF Format dataset from NCCS Portal 
# Scripts written by Nishan Kumar Biswas
# Phd Student and Graduate Research Assistant
# Dept of Civil and Environmental Engineering, University of washington
# email: nbiswas@uw.edu, nishan.wre.buet@gmail.com
## Special Note: This script is valid for NETCDF Version 4 (not for NETCDF Classic Datasets) with spatial georeference only

## Variable declaration
# Input Start date here (Please no date before 6th November 2016, before that date all datsets are of NETCDF classic version)
input_start=2017-06-01
# Input End Date Here
input_end=2017-07-27
# Region name of Africa (It is mentioned in NCCS Data Portal and in the NETCDF File name)
region=('SA' 'WA' 'EA')
# ID used in LIS Visualization Framework
regionID=('southernafrica' 'westafrica' 'eastafrica')
# Models used in Africa Region (also in data folder name in NCCS Data Portal)
model=('NOAH33' 'VIC412')
# Model Notation used in Africa Region (also this notation is used in file naming conventions)
modelnot=('NOAH01' 'VIC025')
# Model IDs used in LIS Visualization
modelID=('noah' 'vic')
# Forcing Parameter Type (RG means RFE & GDAS, CM means Chirps & Merra-Land this notation useeed in folder naming convention of NCCS Data portal)
forcing=('RG' 'CM')
# Forcing Notation used in lIS Visualization(notaions for identifying forcning type of RFE and GDAS or Chirps and Merra)
forcingID=('rg' 'cm')
# Parameter Accummulation Type (For daily data processing, only RFE and GDAS is processed and this variable is not used in for loop, but the "daily" is used to save the PNG files)
# For monthly data processing, this variables will also be used in for loop iteration
parAcc=('daily' 'monthly')
# Parameters used in LIS Visualization (These are the names of the variables which will be extracted from NETCDF Format file)
param=('SM01_Percentile' 'RadT_tavg' 'Rainf_f_tavg')
# Parameter IDs used in LIS Visualization Framework (the nammmes of the above mentioned parameters used in the frontend folder structure)
paramID=('soilmoisture' 'temperature' 'precipitation')

## Processing steps
# Converting user defined input_start in Date Time format
startdate=$(date -I -d "$input_start")
# Converting user defined input_end in DateTime format
enddate=$(date -I -d "$input_end")
# Assigning start date into a new variable to iterate
d="$startdate"
#While loop to iterate from the startdate to the end date 
while [ "$d" != "$enddate" ]; do 
# Assigning the variable into curDate variable which will be updated in each new date
curDate=$(date -d "$d" +"%Y%m%d")
# Writing Processing Date in date.info file which will be used in python processing
echo $curDate > date.info
# Extracting Processing Year which is specified in NCCS Data portal 
curYear=$(date -d "$d" +"%Y")
#Loop over the regions of Africa (east, west, sooouthern)
for((k=0; k<${#region[*]}; k++))
do
#Loop over the models
for((i=0; i<${#model[*]}; i++))
do
#Downloading netcdf dataset of the processing date
echo "Downloading dataset ${modelID[i]}, ${forcingID[0]}, ${regionID[k]} ..."
wget --no-check-certificate https://portal.nccs.nasa.gov/lisdata_pub/FEWSNET/AFRICA_GESDISC/${model[i]}_${forcing[0]}_${region[k]}/${curYear}/FLDAS_${modelnot[i]}_A_${region[k]}_D.A${curDate}.001.nc
echo "Download finished successfully."
echo "Extracting parameters ..."
export GDAL_NETCDF_BOTTOMUP=NO
for((j=0; j<${#param[*]}; j++))
do

#Converting NetCDF variable into AAI Grid File
echo "Parameter Name-${paramID[j]}, Region-${regionID[k]}, Model-${modelID[i]}"
gdal_translate -b 1 -of AAIGrid NETCDF:"FLDAS_${modelnot[i]}_A_${region[k]}_D.A${curDate}.001.nc":${param[j]} ./FLIP_$curDate.asc

# The converted ASCII file is flipped, modifying the header of the AAI Grid to flip it
echo "Changing the header of ASCII file using python ..."
python fliprasterafrica.py

# Converting ASCII file into Geotiff file
echo "Converting corrected ASCII file to Geotiff file..."
gdal_translate -of GTiff ./Corr_$curDate.asc ./${regionID[k]}_${modelID[i]}_${paramID[j]}_$curDate.tif

#Defining projection of the Geotiff file
echo "Defining projection of the geotiff file ..."
gdal_edit.py -a_srs EPSG:4326 ./${regionID[k]}_${modelID[i]}_${paramID[j]}_$curDate.tif

#Converting Projection into Web based projection
echo "Converting projection from WGS84 to Web Based projection system ..."
gdalwarp -s_srs EPSG:4326 -t_srs EPSG:3857 ./${regionID[k]}_${modelID[i]}_${paramID[j]}_$curDate.tif ./web_${regionID[k]}_${modelID[i]}_${paramID[j]}_$curDate.tif

#Applying color ramp to the geotiff file
echo "Applying predefined color palette to the ${paramID[j]} ..."
gdaldem color-relief ./web_${regionID[k]}_${modelID[i]}_${paramID[j]}_$curDate.tif ${paramID[j]}.txt -alpha ./col_${regionID[k]}_${modelID[i]}_${paramID[j]}_$curDate.tif

# Converting GEOTIFF File into PNG file for web publishing
echo "Converting ${paramID[j]} raster into single PNG image for publishing ..."
gdal_translate -of PNG ./col_${regionID[k]}_${modelID[i]}_${paramID[j]}_$curDate.tif ./PNG/${regionID[k]}/${modelID[i]}/${forcingID[0]}/${parAcc[0]}/${paramID[j]}/${curDate}.png

# With every PNG file, an associated projection file created (.xml), Removing that file 
rm ./PNG/*/*/*/*/*/*.xml

# Removing all temporarry .TIFF File, .ASC file and .XML file
rm *.tif *.asc *.xml
done
done
done

# Removing downloaded .nc file and date.info file 
rm *.nc date.info
d=$(date -I -d "$d + 1 day")
done
