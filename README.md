<h1 align="center"> <img height="32" width="32" src="https://cdn.simpleicons.org/itchdotio/fff"/> nnda&nbsp;<sub><sup>.itch.io</sup></sub> </h1>

<div align="center">

Source code for my itch.io profile page.

Main stylesheet—[`src/styles.css`](src/styles.css)
｜
Profile content—[`src/content.html`](src/content.html)

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

  `#E7E9E8` (match `--text` CSS variable)

</td>
</tr>

<tr>
<td> Link </td>
<td>

  `#EAEAEA` (match `--link` CSS variable)

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

Require Node.js `>23.5` or as latest as you possibly can.

1. [Fork](https://github.com/nndda/itchio-profile/fork) this repository, and clone your fork locally.

1. Install the dependencies.
    ```
    npm install
    ```

1. Modify the [`src/styles.css`](src/styles.css) and/or the [`src/content.html`](src/content.html) to your liking.

    See the [Development](#development) section.

1. Bump the `version` field. e.g. from `1.2.0` to `1.3.0`.

1. Build the CSS.
    ```
    npm run build
    ```

1. Test the CSS and the HTML, by copy-pasting the content of `dist/test.css` and `dist/content.html` to your itch.io profile page.

1. If everything's fine and ready, edit `package.json`, and publish your updates.
    ```
    npm run publish
    ```

    And then copy-paste the CSS from `dist/styles.css` to your itch.io profile page, and save it.

> [!IMPORTANT]
> If you've only changed the HTML, there's no ***need to bump the version and publish the update*** via `npm run publish`, as that is only for the CSS updates.
>
> You should, however, run the `npm run build`, and then commit and push the changes to the HTML files yourself.

## Development

How do I update and develop the page with its HTML and CSS.

I use Firefox, because it has a nice style editor feature on its dev tool.

1. Open your itch.io profile page. And clear out the custom CSS field (just clear it out, you don't need to save it).
2. Open the Firefox Web Developer Tools by pressing <kbd>f12</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>.
3. Go to the `Style Editor` tab, and import the CSS source file.

   ![](https://github.com/user-attachments/assets/495e2981-a40e-4d8d-be08-33ddb3567a34)

   You can start working with the CSS from here. And save your changes by pressing <kbd>Ctrl</kbd> + <kbd>S</kbd>.

> [!IMPORTANT]
> When importing CSS file that has unicode characters in it (like this CSS),
> Firefox might break those characters.
>
> To fix that:
> 1. Open the CSS in your favourite text editor.
> 2. Select and copy ALL of the content.
> 3. Go back to the Firefox `Style Editor`, and paste over the imported CSS, **overwriting** it.

As for editing the HTML, I just copy-paste the content of `src/content.html` to the `.user_profile.formatted` element on the `Inspector` tab. Edit it there, and copy it back to the `src/content.html` HTML file.

<div align="center">
  <a href="https://github.com/SAWARATSUKI/KawaiiLogos">
    <img width="520" src="https://github.com/user-attachments/assets/ea12ce4c-abf4-4836-9662-456c67ee2f8b">
  </a>
</div>

## License

[MIT licensed](LICENSE) :)
