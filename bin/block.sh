#!/bin/bash
for i in "$@"; do
	mkdir app/blocks/$i

	touch app/blocks/$i/$i.post.css
	cat > app/blocks/$i/$i.post.css <<- EOM
	.$i {

	}
	EOM
	echo -e "[\033[34mbash\033[0m] Create \033[35mapp/blocks/$i/$i.post.css\033[0m"

	touch app/blocks/$i/$i.post.html
	cat > app/blocks/$i/$i.post.html <<- EOM
	<define-mixin name="$i" mods mix class>
	  <div block="$i" mods="{{ mods }}" mix="{{ mix }}" class="{{ class }}">
	    <content></content>
	  </div>
	</define-mixin>
	EOM
	echo -e "[\033[34mbash\033[0m] Create \033[35mapp/blocks/$i/$i.post.html\033[0m"

	touch app/blocks/$i/$i.js
	echo -e "[\033[34mbash\033[0m] Create \033[35mapp/blocks/$i/$i.js\033[0m"

	cat >> app/styles/main.post.css <<- EOM
	@import '../blocks/$i/$i.post.css';
	EOM
	echo -e "[\033[34mbash\033[0m] Update \033[35mapp/styles/main.post.css\033[0m"

	ed -s app/templates/main.post.html <<- EOM
	/<\/head>/i
	  <include src="blocks/$i/$i.post.html"></include>
	.
	wq
	EOM
	echo -e "[\033[34mbash\033[0m] Update \033[35mapp/templates/main.post.html\033[0m"

	echo -e "[\033[34mbash\033[0m] Block '\033[36m$i\033[0m' created."

done
