<h1 align="center"> <img height="32" width="32" src="https://cdn.simpleicons.org/itchdotio/fff"/> nnda&nbsp;<sub><sup>.itch.io</sup></sub> </h1>

<div align="center">

Source code for my itch.io profile page.
Main stylesheet—[`styles.scss`](styles.scss),
Profile content—[`content.html`](content.html).

<img src="https://github.com/user-attachments/assets/0f8eff10-4bb0-4f08-ab46-b753652355db" alt="">

</div>

<br>

## Page theme settings

<table>
<thead>
<tr>
<td colspan="2">
  <b> Theme setting </b>
</td>
<td>
  <b> Value </b>
</td>
</tr>
</thead>

<tbody>

<tr>
<td rowspan="3"><b> Color </b></td>
<td> BG </td>
<td>

  `#15141B`

</td>
</tr>

<tr>
<td> Text </td>
<td>

  `#E7E9E8`

</td>
</tr>

<tr>
<td> Link </td>
<td>

  `#EAEAEA`

</td>
</tr>


<tr>
<td rowspan="2"><b> Text </b></td>
<td> Font </td>
<td>

  `Zen Kaku Gothic New`

</td>
</tr>

<tr>
<td> Size </td>
<td>

  `96`

</td>
</tr>


<tr>
<td rowspan="1"><b> Images </b></td>
<td> Size </td>
<td>

  `Full width`

</td>
</tr>


<tr>
<td rowspan="2"> My Projects </td>
<td> Layout </td>
<td>

  `Grid`

</td>
</tr>

<tr>
<td> B. Radius </td>
<td>

  `0`

</td>
</tr>


<tr>
<td rowspan="1"><b> Collections </b></td>
<td> Layout </td>
<td>

  `List`

</td>
</tr>
</tbody>
</table>

## Installation

Require Node.js `>23.5`.

1. Fork this repository.

2. Install the dependencies.
  ```
  npm install
  ```

3. Edit `build.js`.
    - Update `version` constant to whatever version you want.
    - Update `githubRepo` constant to the forked GitHub repository path, i.e. `nndda/itchio-profile`

4. Modify the [`styles.scss`](styles.scss) and/or the [`content.html`](content.html) to your liking.

5. Build the CSS.
  ```
  npm run build
  ```

6. Commit and push the changes. Most importantly, stuff under `dist/`.

7. Create a new release. Make sure the release's name and the tag's name matched the `version` constant defined in `build.js`.

8. Copy-paste the CSS from `dist/styles.css` to the profile page's theme editor. And the HTML from `content.html` to your profile page's content.

## License

[MIT licensed](LICENSE) :)
