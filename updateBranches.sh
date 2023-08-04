#!/bin/bash
branches=('main' 'calculate' 'edicionREADME' 'filter' 'pu' 'search' 'show' 'sort' 'style' 'pruebaAjv')
for i in ${branches[@]}; 
do
 echo "\e[01;32;40 Branch $i: \e[m"
 git checkout $i
 git status
 git pull origin main
 git push origin $i
done
