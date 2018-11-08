<input type="hidden" value="<?php echo $this->session->userdata('__token__')?>" id="__token__">
<script>
	window.localStorage.setItem('__token__', document.getElementById('__token__').value);
</script>

<div id="root"></div>

<script type="text/javascript" src="<?php echo base_url('src/build/watchfile.bundle.js') ?>"></script> 
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<link rel="stylesheet" type="text/css" href= "<?php echo base_url('node_modules/react-table/react-table.css') ?>">
