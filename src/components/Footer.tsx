export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black px-6 py-10 sm:px-12 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="cursor-pointer hover:text-white">Audio & Subtitles</li>
              <li className="cursor-pointer hover:text-white">Media Center</li>
              <li className="cursor-pointer hover:text-white">Privacy</li>
              <li className="cursor-pointer hover:text-white">Contact Us</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="cursor-pointer hover:text-white">Audio Description</li>
              <li className="cursor-pointer hover:text-white">Investor Relations</li>
              <li className="cursor-pointer hover:text-white">Legal Notices</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="cursor-pointer hover:text-white">Help Center</li>
              <li className="cursor-pointer hover:text-white">Jobs</li>
              <li className="cursor-pointer hover:text-white">Cookie Preferences</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="cursor-pointer hover:text-white">Gift Cards</li>
              <li className="cursor-pointer hover:text-white">Terms of Use</li>
              <li className="cursor-pointer hover:text-white">Corporate Info</li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-xs text-gray-500">
          © 2026 Flixily — Built with TMDB API. This is a fan-made project for educational purposes only.
        </p>
      </div>
    </footer>
  );
}
