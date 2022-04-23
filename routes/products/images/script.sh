for x in *
do
cwebp $x -o new/${x//jpg/webp}
done
