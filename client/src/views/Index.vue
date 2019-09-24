<template>
  <div>
    <Navbar />
    <div class="max-w-4xl mx-auto mt-5 flex">
      <div class="w-3/4">
        <div class="text-indigo-800 bg-indigo-100 rounded p-4">
          <table class="w-full text-left text-sm leading-loose">
            <thead>
              <th>Room name</th>
              <th>Owner</th>
              <th>Players</th>
              <th></th>
              <th></th>
            </thead>
            <tbody>
              <tr class="bg-indigo-200">
                <td class="py-1 px-3 rounded-l">
                  Test room
                </td>
                <td class="py-2 px-3">
                  Gino
                </td>
                <td class="py-2 px-3">
                  10
                </td>
                <td class="py-2 px-3">
                  Open
                </td>
                <td class="py-2 px-3 rounded-r">
                  <button class="bg-indigo-600 shadow-inner float-right px-6 py-1 rounded text-white font-bold">Join</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="ml-5 w-1/4">
        <div class="mb-5">
          <button class="text-sm w-full text-indigo-600 border border-indigo-300 focus:outline-none font-semibold bg-indigo-100 rounded px-5 py-3">Create a room</button>
        </div>
        <div class="mb-5">
          <div class="text-white bg-indigo-700 text-sm font-bold px-4 py-4 rounded-t">
            Statistics
          </div>
          <div class="bg-indigo-800 text-indigo-100 py-3 px-4 rounded-b text-sm leading-loose">
            <div><span class="text-white font-bold">0</span> active games</div>
            <div><span class="text-white font-bold">0</span> online users</div>
          </div>
        </div>

        <div>
          <div class="text-white bg-indigo-700 text-sm font-bold px-4 py-4 rounded-t">
            Filter by
          </div>
          <div class="bg-indigo-800 text-indigo-100 py-3 px-4 rounded-b text-sm leading-loose">
            <select class="w-full rounded px-3 py-1 focus:outline-none shadow-inner cursor-pointer appearance-none text-indigo-100 bg-indigo-900 font-semibold text-sm mb-3">
              <option>All players</option>
              <option>Most players</option>
              <option>Least players</option>
            </select>
            <select class="w-full rounded px-3 py-1 focus:outline-none shadow-inner cursor-pointer appearance-none text-indigo-100 bg-indigo-900 font-semibold text-sm mb-3">
              <option>All spectators</option>
              <option>Most spectators</option>
              <option>Least spectators</option>
            </select>
            <select class="w-full rounded px-3 py-1 focus:outline-none shadow-inner cursor-pointer appearance-none text-indigo-100 bg-indigo-900 font-semibold text-sm mb-3">
              <option>All rooms</option>
              <option>Public rooms</option>
              <option>Private rooms</option>
            </select>

            <select class="w-full rounded px-3 py-1 focus:outline-none shadow-inner cursor-pointer appearance-none text-indigo-100 bg-indigo-900 font-semibold text-sm">
              <option>Created anytime</option>
              <option>Recently created</option>
              <option>Longest created</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Navbar from '../components/Navbar'

export default {
  components: {
    Navbar
  }
}
</script>
