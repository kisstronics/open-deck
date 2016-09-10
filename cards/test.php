<?php
$dn = 2;
for($i=1;$i<=52*$dn;$i++) {
	echo $i." >>> ".($i%13)." >>> ".intval($i/13)." >>> ".intval(intval($i/13)%4)."<br>";
	if ($i%13 == 0) {
		echo "<br>";
	}
}

0 0
1 1
2 2
3 3
4 0
5 1
6 2
7 3