#Historical raster post processing of LIS Output for Central Asia
#Input Start date here
input_start=2017-03-04
#Input End Date Here
input_end=2017-03-15
#Region name of Central Asia
region='CA'
#ID used in LIS Visualization Framework
regionID='centralasia'
#Models used in Central Asia
model=('NOAH32')
#Model IDs used in LIS Visualization
modelID=('noah')
#Parameters used in LIS Visualization
param=('swe_mm' 'avg_surface_temp_degC')
#Parameter IDs used in LIS Visualization Framework
paramID=('swe' 'temperature' 'precipitation')
#Converting Start Date in Date Time format
startdate=$(date -I -d "$input_start")
#Converting End Date into DateTime format
enddate=$(date -I -d "$input_end")
d="$startdate"
while [ "$d" != "$enddate" ]; do 
curDate=$(date -d "$d" +"%Y%m%d")
#Writing Processing Date in date.info file
echo $curDate > date.info
#Extracting Processing Year 
curYear=$(date -d "$d" +"%Y")
#Loop over the models
for((i=0; i<${#model[*]}; i++))
do
#Downloading netcdf dataset of the processing date
wget --no-check-certificate https://portal.nccs.nasa.gov/lisdata_pub/FEWSNET/Asia_2016_2017/NASA_LIS_${model[i]}_${curDate}0000.tgz
#https://portal.nccs.nasa.gov/lisdata_pub/FEWSNET/Asia_2016_2017/
tar -xvzf ./NASA_LIS_${model[i]}_${curDate}0000.tgz
for((j=0; j<${#param[*]}; j++))
do
gdalwarp -te 60.0 25.0 90.0 40.0 ./LIS_${model[i]}_Asia_${param[j]}_${curDate}00.tif ./LIS_${model[i]}_Asia_${param[j]}_${curDate}00_crop.tif
gdaldem color-relief ./LIS_${model[i]}_Asia_${param[j]}_${curDate}00_crop.tif ${paramID[j]}.txt -alpha ./${modelID[i]}_${regionID}_${param[j]}_${curDate}.tif
gdal_translate -of PNG ./${modelID[i]}_${regionID}_${param[j]}_${curDate}.tif ./PNG/${regionID}/${modelID[i]}/gdas/daily/${paramID[j]}/${curDate}.png
done
rm *.tif
rm ./PNG/*/*/*/*/*/*.xml
rm *.tgz

#export GDAL_NETCDF_BOTTOMUP=NO
#for((j=0; j<${#param[*]}; j++))
#do
#Converting NetCDF variable into AAI Grid File
#gdal_translate -b 1 -of AAIGrid NETCDF:"NASA_LIS_${model[i]}_${curDate}0000.d01.nc":${param[j]} ./FLIP_$curDate.asc
#Modifying the header of the AAI Grid to fit into WGS 84 Projection
#python correctasiaraster.py
#Converting ASCII file into Geotiff file
#gdal_translate -of GTiff ./Corr_$curDate.asc ./${regionID}_${modelID[i]}_${paramID[j]}_$curDate.tif
#Defining projection of the Geotiff file
#gdal_edit.py -a_srs EPSG:4326 ./${regionID}_${modelID[i]}_${paramID[j]}_$curDate.tif
#Converting Projection into Web based projection
#gdalwarp -s_srs EPSG:4326 -t_srs EPSG:3857 ./${regionID}_${modelID[i]}_${paramID[j]}_$curDate.tif ./web_${regionID}_${modelID[i]}_${paramID[j]}_$curDate.tif
#Applying color ramp to the geotiff file
#gdaldem color-relief ./web_${regionID}_${modelID[i]}_${paramID[j]}_$curDate.tif ${paramID[j]}.txt -alpha ./col_${regionID}_${modelID[i]}_${paramID[j]}_$curDate.tif
#Preparing tiles from the colored geotiff files
#gdal2tiles.py -z 2-6 -g AIzaSyDrem9f_u_ZeOrQIjLzKTmGFcrQ2cTxPuE ./col_${regionID}_${modelID[i]}_${paramID[j]}_$curDate.tif ./Tile/${regionID}/${modelID[i]}/${paramID[j]}/$curDate/
#rm *.tif *.asc *.xml
#done
done
#rm *.nc date.info
d=$(date -I -d "$d + 1 day")
done
