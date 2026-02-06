import mongoose, { mongo } from "mongoose";

const homeBannerSliderSchema = mongoose.Schema(
    {
       
        images: [
            {
                type: String
            }
        ],

    },
    {timestamps: true}
);

const HomeBannerSliderModel = mongoose.model('homeBannerSlider',homeBannerSliderSchema);
export default HomeBannerSliderModel