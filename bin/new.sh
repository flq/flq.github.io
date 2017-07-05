# create a new post
todayFile=$(date +"%Y-%m-%d")
todayContent=$(date +"%Y-%m-%d %T")

printf "Title: "
read -r title

printf "Tags (csv): "
read -r tags

titleForFile=$(echo "$title" | 
	sed 's/[ ?<>*=!,'\'']/-/g' | 
	sed -E 's/-+/-/g' | sed -E 's/-$//g')

cat >../_posts/$todayFile-$titleForFile.md <<EOL
---
title: "$title"
layout: post
tags: [$tags]
date: $todayContent
---

EOL

echo "../_posts/$todayFile-$titleForFile.md" | pbcopy
echo "created $titleForFile and put path to clipboard"

