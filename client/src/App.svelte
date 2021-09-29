<div class="navbar mb-2  text-neutral-content ">
  
  <div class="flex-1 hidden px-2 mx-2 lg:flex">
    <span class="text-lg font-bold text-accent">
            Gito Explorer
    </span>
  </div> 
  <div class="flex-1 lg:flex-none">
    <div class="form-control">
      <input type="text" placeholder="Search" class="input input-ghost">
    </div>
  </div> 
  <div class="flex-none">
    <button class="btn btn-square btn-ghost">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">             
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>             
      </svg>
    </button>
  </div> 
  
</div>

<div class="overflow-x-auto">
  <table class="table w-full border border-gray-500">
    <thead class="border-b">
      <tr>
        <th>
          <label>
            <input type="checkbox" class="checkbox checkbox-accent border">
          </label>
        </th> 
        <th class="text-accent">Name</th> 
        <th class="text-accent">duration</th> 
        <th class="text-accent">Created</th> 
        <th></th>
      </tr>
    </thead> 
    <tbody>
      <tr>
        <th>
          <label>
            <input type="checkbox" class="checkbox checkbox-accent">
          </label>
        </th> 
        <td>
          <div class="flex items-center space-x-3">
            <div>
              <div class="font-bold">
                  test recording 1
              </div> 
              <div class="text-sm opacity-50">
                    #j32wjahh3
                  </div>
            </div>
          </div>
        </td> 
        <td>
            00:15
         <br> 
         <span class="badge badge-accent badge-sm">3 files edited</span>
        </td> 
        <td>27 sept 21, 12:52PM</td> 

		<th>
          <button class="btn btn-ghost btn-xs">play | delete | archive</button>
        </th>
        
      </tr>

      <tr>
        <th>
          <label>
            <input type="checkbox" class="checkbox checkbox-accent">
          </label>
        </th> 
        <td>
          <div class="flex items-center space-x-3">
            <div>
              <div class="font-bold">
                  test recording 2
              </div> 
              <div class="text-sm opacity-50">
                    #cqw2jahh3
                  </div>
            </div>
          </div>
        </td> 
        <td>
            01:04
         <br> 
         <span class="badge badge-accent badge-sm">1 files edited</span>
        </td> 
        <td>27 sept 21, 12:57PM</td> 
        
		<th>
          <button class="btn btn-ghost btn-xs">play | delete | archive</button>
        </th>
      </tr>

      <tr>
        <th>
          <label>
            <input type="checkbox" class="checkbox checkbox-accent">
          </label>
        </th> 
        <td>
          <div class="flex items-center space-x-3">
            <div>
              <div class="font-bold">
                  test recording 3
              </div> 
              <div class="text-sm opacity-50">
                    #mn2wjahh7
                  </div>
            </div>
          </div>
        </td> 
        <td>
            00:45
         <br> 
         <span class="badge badge-accent badge-sm">3 files edited</span>
        </td> 
        <td>27 sept 21, 1:15PM</td> 
		<th>
          <button class="btn btn-ghost btn-xs">play | delete | archive</button>
        </th>
        
      </tr>
      
    </tbody> 
  </table>
</div>
<style>
	:global(body, html, table, thead, tbody, tr, td, th){
		background: transparent !important;
	}

</style>

<svelte:head>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1/dist/tailwind.min.css" rel="stylesheet" type="text/css" />
  <link href="https://cdn.jsdelivr.net/npm/daisyui@1.14.0/dist/full.css" rel="stylesheet" type="text/css" />
</svelte:head>
