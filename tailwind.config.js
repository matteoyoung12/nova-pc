/** @type {import('tailwindcss').Config} */
export default {content:['./client/index.html','./client/src/**/*.{js,jsx}'],theme:{extend:{fontFamily:{sans:['Inter','system-ui','sans-serif']},animation:{marquee:'marquee 24s linear infinite'},keyframes:{marquee:{from:{transform:'translateX(0)'},to:{transform:'translateX(-50%)'}}}}},plugins:[]};
