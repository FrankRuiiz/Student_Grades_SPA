

// compare object
var compare = {
  name: function(a, b) {
      if ( a < b ) {
          return -1;
      }
      else {
          return a > b ? 1 : 0;  // if a is greater than b return 1 or if they are the same return 0
      }
  }
};

$('.student-list').each(function() {
    var $table = $(this);
    var $tbody = $table.find('tbody');
    var $controls = $table.find('th');
    var rows = $tbody.find('tr');  // store array containing rows
    rows.toArray();
    console.log('rows', rows);
    $controls.on('click', function() {
        var $header = $(this);
        console.log($header);
        var order = $header.data('sort');
        var column;


    if($header.is('.ascending') || $header.is('.descending')) {
        $header.toggleClass('ascending descending');
        $tbody.append(rows.reverse());
    }
    else {
        $header.addClass('ascending');
        $header.siblings().removeClass('.ascending descending');
        if ( compare.hasOwnProperty(order)) {
            column = $controls.index(this);

            rows.sort(function(a, b) {
               a = $(a).find('td').eq(column).text();
               b = $(b).find('td').eq(column).text();
               return compare[order](a, b);
            });

            $tbody.append(rows);
        }
    }
    });
});

